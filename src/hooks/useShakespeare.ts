import { useCallback, useState } from 'react';
import { useCurrentUser } from './useCurrentUser';
import type { NUser } from '@nostrify/react/login';

// Types for Shakespeare API (compatible with OpenAI ChatCompletionMessageParam)
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface Model {
  id: string;
  name: string;
  description: string;
  object: string;
  owned_by: string;
  created: number;
  context_window: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

export interface ModelsResponse {
  object: string;
  data: Model[];
}

// Configuration
const SHAKESPEARE_API_URL = 'https://ai.shakespeare.diy/v1';

// Helper function to create NIP-98 token
async function createNIP98Token(
  method: string,
  url: string,
  body?: unknown,
  user?: NUser
): Promise<string> {
  if (!user?.signer) {
    throw new Error('User signer is required for NIP-98 authentication');
  }

  const tags: string[][] = [
    ['u', url],
    ['method', method]
  ];

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    const bodyString = JSON.stringify(body);
    const encoder = new TextEncoder();
    const data = encoder.encode(bodyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const payloadHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    tags.push(['payload', payloadHash]);
  }

  const event = await user.signer.signEvent({
    kind: 27235,
    content: '',
    tags,
    created_at: Math.floor(Date.now() / 1000)
  });

  return btoa(JSON.stringify(event));
}

async function handleAPIError(response: Response) {
  if (response.status === 401) {
    throw new Error('Authentication failed. Please make sure you are logged in with a Nostr account.');
  } else if (response.status === 402) {
    throw new Error('Insufficient credits. Please add credits to your account.');
  } else if (response.status >= 500) {
    throw new Error('Server error. Please try again in a few moments.');
  } else if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    } catch {
      throw new Error(`Network error: ${response.statusText}`);
    }
  }
}

export function useShakespeare() {
  const { user } = useCurrentUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const sendChatMessage = useCallback(async (
    messages: ChatMessage[],
    model: string = 'shakespeare',
    options?: Partial<ChatCompletionRequest>
  ): Promise<ChatCompletionResponse> => {
    if (!user) {
      throw new Error('User must be logged in to use AI features');
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody: ChatCompletionRequest = {
        model,
        messages,
        ...options
      };

      const token = await createNIP98Token(
        'POST',
        `${SHAKESPEARE_API_URL}/chat/completions`,
        requestBody,
        user
      );

      const response = await fetch(`${SHAKESPEARE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Nostr ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      await handleAPIError(response);
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const sendStreamingMessage = useCallback(async (
    messages: ChatMessage[],
    model: string = 'shakespeare',
    onChunk: (chunk: string) => void,
    options?: Partial<ChatCompletionRequest>
  ): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in to use AI features');
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestBody: ChatCompletionRequest = {
        model,
        messages,
        stream: true,
        ...options
      };

      const token = await createNIP98Token(
        'POST',
        `${SHAKESPEARE_API_URL}/chat/completions`,
        requestBody,
        user
      );

      const response = await fetch(`${SHAKESPEARE_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Nostr ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      await handleAPIError(response);

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  onChunk(content);
                }
              } catch {
                // Ignore parsing errors for incomplete chunks
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const getAvailableModels = useCallback(async (): Promise<ModelsResponse> => {
    if (!user) {
      throw new Error('User must be logged in to use AI features');
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await createNIP98Token(
        'GET',
        `${SHAKESPEARE_API_URL}/models`,
        undefined,
        user
      );

      const response = await fetch(`${SHAKESPEARE_API_URL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Nostr ${token}`,
        },
      });

      await handleAPIError(response);
      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      throw new Error(errorMessage, { cause: err });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    error,
    isAuthenticated: !!user,
    sendChatMessage,
    sendStreamingMessage,
    getAvailableModels,
    clearError,
  };
}
