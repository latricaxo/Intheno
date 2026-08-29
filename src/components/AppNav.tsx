import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LoginArea } from '@/components/auth/LoginArea';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Menu, X, Search, BookOpen, Users, PenLine, Compass, HelpCircle, Heart } from 'lucide-react';

const NAV_LINKS = [
  { href: '/explore', label: 'Explore', icon: Compass },
  { href: '/contribute', label: 'Contribute', icon: PenLine },
  { href: '/request', label: 'Request', icon: HelpCircle },
  { href: '/about', label: 'About', icon: BookOpen },
  { href: '/support', label: 'Support', icon: Heart },
];

export function AppNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useCurrentUser();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="container">
          <div className="flex h-14 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground hover:opacity-80 transition-opacity"
              aria-label="INTHENO home"
            >
              <div className="w-7 h-7 rounded-md flex items-center justify-center"
                style={{ background: 'var(--intheno-brand)' }}>
                <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-extrabold tracking-[-0.04em]">INTHENO</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive(href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  {label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/contributions"
                  className={cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive('/contributions')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  My Knowledge
                </Link>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Link to="/search" aria-label="Search">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </Link>
              <LoginArea className="max-w-40" />
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="container py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive(href)
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/contributions"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive('/contributions')
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/60'
                  )}
                >
                  <Users className="h-4 w-4" />
                  My Knowledge
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
