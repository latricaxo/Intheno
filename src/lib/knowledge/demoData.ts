import type { KnowledgeArticle } from './types';

// Demo contributor — clearly fictional, marked as demo
const DEMO_CONTRIBUTOR = {
  pubkey: '0000000000000000000000000000000000000000000000000000000000000001',
  npub: 'npub1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqs0a89u',
  displayName: 'INTHENO Demo Library',
  nip05: 'demo@intheno.app',
};

const now = Math.floor(Date.now() / 1000);

export const DEMO_ARTICLES: KnowledgeArticle[] = [
  // ===== SCIENCE =====
  {
    id: 'demo-sky-blue',
    title: 'Why Is the Sky Blue?',
    subject: 'why-is-the-sky-blue',
    question: 'Why is the sky blue?',
    content: `The sky appears blue because of a phenomenon called **Rayleigh scattering**.

## The Science

Sunlight appears white but is actually composed of all the colors of the visible spectrum — from red through orange, yellow, green, and blue to violet. When sunlight enters Earth's atmosphere, it collides with gas molecules (primarily nitrogen and oxygen).

These tiny molecules scatter shorter wavelengths of light (blue and violet) much more effectively than longer wavelengths (red and orange). The scattering intensity is inversely proportional to the fourth power of the wavelength — meaning blue light (~450 nm) is scattered roughly 5–6 times more than red light (~700 nm).

## Why Blue and Not Violet?

Violet light is scattered even more than blue, so you might expect the sky to appear violet. There are two reasons it doesn't:

1. The Sun emits more blue light than violet light.
2. Human eyes are more sensitive to blue than to violet.

The combination means we perceive the sky as blue.

## Sunrise and Sunset

At sunrise and sunset, sunlight travels through much more atmosphere to reach your eyes. Most of the blue light is scattered away before it arrives, leaving the longer wavelengths — reds, oranges, and pinks — which give sunsets their characteristic colors.`,
    summary: 'Sunlight scatters off atmospheric molecules. Shorter (blue) wavelengths scatter more than longer (red) ones — this is Rayleigh scattering.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 30,
    updatedAt: now - 86400 * 10,
    sources: [
      { name: 'NASA Science', title: 'Why Is the Sky Blue?', url: 'https://science.nasa.gov/ask-an-astrophysicist/why-is-the-sky-blue/' },
      { name: 'NOAA', title: 'Rayleigh Scattering', url: 'https://www.noaa.gov/' },
    ],
    tags: ['rayleigh-scattering', 'atmosphere', 'optics', 'light', 'physics'],
    category: 'Science',
    related: ['What Is Light?', 'Earth\'s Atmosphere', 'Rayleigh Scattering'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-photosynthesis',
    title: 'How Does Photosynthesis Work?',
    subject: 'how-does-photosynthesis-work',
    question: 'How does photosynthesis work?',
    content: `**Photosynthesis** is the process by which plants, algae, and some bacteria convert light energy into chemical energy stored as glucose.

## The Basic Equation

The overall reaction can be summarized as:

> 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂

Carbon dioxide and water, powered by sunlight, are converted into glucose and oxygen.

## Two Stages

### Light-Dependent Reactions (in the thylakoid membranes)

1. Chlorophyll and other pigments absorb sunlight.
2. Water molecules are split (photolysis), releasing oxygen as a byproduct.
3. The captured light energy is used to produce ATP and NADPH — energy carriers.

### Light-Independent Reactions / Calvin Cycle (in the stroma)

1. CO₂ from the atmosphere is "fixed" by an enzyme called RuBisCO.
2. Using ATP and NADPH from the light reactions, CO₂ is converted into glucose through a series of chemical steps.
3. The cycle regenerates its starting molecule (RuBP) to continue.

## Why It Matters

Photosynthesis is the foundation of almost all food chains on Earth. It produces the oxygen in Earth's atmosphere and removes CO₂, making it critical to climate regulation.`,
    summary: 'Plants use sunlight, water, and CO₂ to produce glucose and oxygen through two stages: light-dependent reactions and the Calvin Cycle.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 25,
    updatedAt: now - 86400 * 5,
    sources: [
      { name: 'Khan Academy', title: 'Photosynthesis', url: 'https://www.khanacademy.org/science/ap-biology/cellular-energetics/photosynthesis/a/intro-to-photosynthesis' },
      { name: 'Biology Online', title: 'Photosynthesis Overview', url: 'https://www.biologyonline.com/' },
    ],
    tags: ['photosynthesis', 'plants', 'biology', 'chlorophyll', 'energy'],
    category: 'Science',
    related: ['Cellular Respiration', 'Chlorophyll', 'Carbon Cycle'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-seasons',
    title: 'Why Do Seasons Occur?',
    subject: 'why-do-seasons-occur',
    question: 'Why do seasons occur?',
    content: `Seasons occur because of the **tilt of Earth's axis** — not because of Earth's distance from the Sun.

## Earth's Axial Tilt

Earth's axis is tilted approximately 23.5° relative to its orbital plane around the Sun. This tilt remains relatively constant as Earth orbits the Sun throughout the year.

## Summer

When the Northern Hemisphere is tilted toward the Sun:
- Sunlight hits at a more direct angle (concentrated over a smaller area)
- Days are longer, so the Sun has more time to warm the surface
- The result is summer

## Winter

When the Northern Hemisphere is tilted away from the Sun:
- Sunlight hits at a shallower angle (spread over a larger area)
- Days are shorter
- The result is winter

The Southern Hemisphere experiences opposite seasons simultaneously.

## Distance Is Not the Cause

Earth is actually slightly *closer* to the Sun in January (perihelion) — during Northern Hemisphere winter — than in July (aphelion). This proves seasons aren't caused by orbital distance.

## Equinoxes and Solstices

- **Solstices** (June 21, Dec 21): Maximum tilt toward/away from Sun — longest and shortest days
- **Equinoxes** (March 20, Sep 23): Neither hemisphere tilted toward the Sun — day and night approximately equal`,
    summary: 'Seasons are caused by Earth\'s 23.5° axial tilt, not its distance from the Sun. The tilted hemisphere receives more direct sunlight and has longer days.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 20,
    updatedAt: now - 86400 * 3,
    sources: [
      { name: 'NASA', title: 'What Causes the Seasons?', url: 'https://spaceplace.nasa.gov/seasons/en/' },
    ],
    tags: ['seasons', 'earth', 'axial-tilt', 'astronomy', 'solstice'],
    category: 'Science',
    related: ['Earth\'s Orbit', 'Solstices and Equinoxes', 'Climate Zones'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-tides',
    title: 'What Causes Tides?',
    subject: 'what-causes-tides',
    question: 'What causes tides?',
    content: `Tides are caused primarily by the **gravitational pull of the Moon** on Earth's oceans, with a secondary contribution from the Sun.

## Lunar Gravity

The Moon's gravity pulls on Earth's water. The side of Earth facing the Moon experiences a stronger gravitational pull, causing water to bulge toward the Moon. Simultaneously, the opposite side also experiences a bulge — caused by the centrifugal effect of Earth-Moon orbital motion.

This creates two high-tide bulges: one facing the Moon, one on the far side.

## The Tidal Cycle

As Earth rotates once per day, most coastal areas pass through:
- Two **high tides** (under each bulge)
- Two **low tides** (between the bulges)

This is called a **semidiurnal** tidal pattern.

## Spring and Neap Tides

**Spring tides** occur during new and full moons, when the Sun, Moon, and Earth align. The Sun's gravity reinforces the Moon's, creating higher-than-normal high tides and lower-than-normal low tides.

**Neap tides** occur during quarter moons when the Sun and Moon are at right angles. Their effects partially cancel, resulting in smaller tidal ranges.

## The Sun's Role

The Sun has about 46% of the Moon's tidal influence on Earth, despite being far more massive — because tidal force depends on the *rate of change* of gravity across Earth's diameter, and the Moon, being much closer, wins.`,
    summary: 'Tides are caused by the Moon\'s gravitational pull creating two water bulges on Earth. The Sun also contributes, causing spring and neap tides.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 18,
    updatedAt: now - 86400 * 2,
    sources: [
      { name: 'NOAA', title: 'Tides and Water Levels', url: 'https://oceanservice.noaa.gov/education/tutorial_tides/welcome.html' },
    ],
    tags: ['tides', 'moon', 'gravity', 'oceans', 'astronomy'],
    category: 'Science',
    related: ['Moon\'s Gravity', 'Ocean Currents', 'Lunar Cycles'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-eclipse',
    title: 'How Does an Eclipse Happen?',
    subject: 'how-does-an-eclipse-happen',
    question: 'How does an eclipse happen?',
    content: `An eclipse occurs when one astronomical body passes into the shadow of another.

## Solar Eclipse

A **solar eclipse** happens when the Moon passes directly between Earth and the Sun, blocking sunlight from reaching parts of Earth.

- **Total solar eclipse**: The Moon completely covers the Sun's disk. The Sun's corona becomes visible. Only a narrow path (the umbra) experiences totality.
- **Partial solar eclipse**: Only part of the Sun is covered.
- **Annular solar eclipse**: The Moon is at apogee (farthest from Earth) so appears smaller and leaves a ring ("annulus") of sunlight visible.

## Lunar Eclipse

A **lunar eclipse** happens when Earth passes between the Sun and the Moon, casting Earth's shadow on the Moon.

- **Total lunar eclipse**: The Moon passes entirely through Earth's umbra. The Moon often appears red ("Blood Moon") because Earth's atmosphere refracts red light onto it.
- **Partial lunar eclipse**: Only part of the Moon enters the umbra.
- **Penumbral lunar eclipse**: The Moon passes through only Earth's penumbra (outer shadow) — difficult to notice.

## Why Not Every Month?

The Moon's orbit is tilted ~5° relative to Earth's orbital plane. Most new/full moons pass slightly above or below the Sun-Earth line. Eclipses only occur when the Moon is near a **node** — one of two points where its orbit crosses Earth's orbital plane.`,
    summary: 'Solar eclipses occur when the Moon blocks the Sun; lunar eclipses when Earth\'s shadow falls on the Moon. They only happen when the Moon is near its orbital nodes.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 15,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'NASA', title: 'Solar Eclipses', url: 'https://science.nasa.gov/eclipses/' },
    ],
    tags: ['eclipse', 'moon', 'sun', 'astronomy', 'shadow'],
    category: 'Science',
    related: ['Solar Eclipse', 'Lunar Eclipse', 'Moon\'s Orbit'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },

  // ===== MATHEMATICS =====
  {
    id: 'demo-pythagorean-theorem',
    title: 'What Is the Pythagorean Theorem?',
    subject: 'what-is-the-pythagorean-theorem',
    question: 'What is the Pythagorean theorem?',
    content: `The **Pythagorean Theorem** states that in a right triangle, the square of the length of the hypotenuse equals the sum of the squares of the other two sides.

## The Formula

> **a² + b² = c²**

Where:
- **a** and **b** are the two legs (the sides adjacent to the right angle)
- **c** is the hypotenuse (the side opposite the right angle — always the longest side)

## Example

If a right triangle has legs of 3 and 4:

3² + 4² = c²
9 + 16 = 25
c = √25 = **5**

This is the famous 3-4-5 right triangle.

## Applications

The theorem is used constantly in:
- Construction and carpentry (checking square corners)
- Navigation (finding direct distances)
- Physics (vector magnitudes)
- Computer graphics (distance calculations)
- GPS systems

## Origins

Named after the ancient Greek mathematician **Pythagoras** (c. 570–495 BC), though the relationship was known to Babylonian and Indian mathematicians centuries earlier. More than 370 proofs of the theorem exist.

## Converse

The converse is also true: if a² + b² = c² for the three sides of a triangle, then the triangle is a right triangle.`,
    summary: 'In a right triangle, a² + b² = c². The square of the hypotenuse equals the sum of the squares of the other two sides.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 28,
    updatedAt: now - 86400 * 7,
    sources: [
      { name: 'Khan Academy', title: 'Pythagorean Theorem', url: 'https://www.khanacademy.org/math/geometry/hs-geo-trig/hs-geo-pythagorean-theorem/a/pythagorean-theorem-review' },
      { name: 'Britannica', title: 'Pythagorean Theorem', url: 'https://www.britannica.com/science/Pythagorean-theorem' },
    ],
    tags: ['pythagorean-theorem', 'geometry', 'triangles', 'mathematics', 'right-triangle'],
    category: 'Mathematics',
    related: ['Trigonometry', 'Right Triangle', 'Distance Formula'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-prime-numbers',
    title: 'What Is a Prime Number?',
    subject: 'what-is-a-prime-number',
    question: 'What is a prime number?',
    content: `A **prime number** is a natural number greater than 1 that has no positive divisors other than 1 and itself.

## Definition

A number p > 1 is prime if and only if its only divisors are 1 and p.

**Prime numbers**: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, ...

**Composite numbers** (not prime): 4, 6, 8, 9, 10, 12, 14, 15, ...

## Notable Properties

- **2** is the only even prime number
- There are infinitely many primes (proved by Euclid around 300 BC)
- Primes become less frequent as numbers get larger, but never stop
- The **Fundamental Theorem of Arithmetic**: every integer > 1 can be expressed uniquely as a product of primes (prime factorization)

## Why Prime Numbers Matter

Primes are the "atoms" of arithmetic — every whole number is built from them.

They are central to **cryptography**: RSA encryption and many other systems rely on the difficulty of factoring large numbers into their prime components. A 2048-bit RSA key involves primes with hundreds of digits.

## Testing for Primality

Simple method: try dividing by all integers from 2 up to √n. If none divide evenly, n is prime.

Modern cryptography uses sophisticated algorithms to test very large primes quickly.`,
    summary: 'A prime number has exactly two divisors: 1 and itself. There are infinitely many primes, and they are fundamental to modern cryptography.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 22,
    updatedAt: now - 86400 * 4,
    sources: [
      { name: 'Britannica', title: 'Prime Number', url: 'https://www.britannica.com/science/prime-number' },
    ],
    tags: ['prime-numbers', 'mathematics', 'number-theory', 'cryptography'],
    category: 'Mathematics',
    related: ['Number Theory', 'RSA Encryption', 'Fundamental Theorem of Arithmetic'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-divide-by-zero',
    title: "Why Can't We Divide by Zero?",
    subject: 'why-cant-we-divide-by-zero',
    question: "Why can't we divide by zero?",
    content: `Division by zero is **undefined** in standard mathematics because it leads to logical contradictions and inconsistencies.

## What Does Division Mean?

Dividing a ÷ b asks: "What number, when multiplied by b, gives a?"

So 10 ÷ 2 = 5 because 5 × 2 = 10.

## Why Zero Breaks This

If 10 ÷ 0 = x, then x × 0 should equal 10.
But anything × 0 = 0, not 10. There is no number x that works.

## What About 0 ÷ 0?

This is indeterminate, not just undefined. If 0 ÷ 0 = x, then x × 0 = 0, which is true for *any* value of x. So 0 ÷ 0 could be 1, 5, 100, or anything — it has no unique answer.

## The Limit Approach

In calculus, we consider what happens as a denominator *approaches* zero:
- 1/x as x → 0⁺ grows toward +∞
- 1/x as x → 0⁻ grows toward −∞

The limits are different from each side, confirming division by zero has no consistent value.

## In Computing

Most programming languages throw a "division by zero" error or exception. Floating-point arithmetic sometimes returns "Infinity" or "NaN" (Not a Number).`,
    summary: 'Division by zero is undefined because no number times zero equals any nonzero value. It produces logical contradictions in standard arithmetic.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 19,
    updatedAt: now - 86400 * 3,
    sources: [
      { name: 'Khan Academy', title: 'Division by Zero', url: 'https://www.khanacademy.org/' },
    ],
    tags: ['division-by-zero', 'mathematics', 'arithmetic', 'undefined'],
    category: 'Mathematics',
    related: ['Limits in Calculus', 'Infinity', 'Arithmetic'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-probability',
    title: 'What Is Probability?',
    subject: 'what-is-probability',
    question: 'What is probability?',
    content: `**Probability** is a measure of how likely an event is to occur, expressed as a number between 0 and 1 (or 0% to 100%).

## The Scale

- **0** = impossible (will never happen)
- **1** = certain (will always happen)
- **0.5** = equally likely to happen or not

## Classical Probability

For equally likely outcomes:

> P(event) = (number of favorable outcomes) / (total number of possible outcomes)

**Example**: Rolling a 3 on a fair die:
P(3) = 1/6 ≈ 0.167 (16.7%)

## Rules

- **Complement**: P(not A) = 1 − P(A)
- **Addition**: P(A or B) = P(A) + P(B) − P(A and B)
- **Multiplication** (independent events): P(A and B) = P(A) × P(B)

## Types

- **Theoretical probability**: Based on mathematical reasoning
- **Experimental probability**: Based on observed frequencies
- **Subjective probability**: Based on personal judgment or incomplete information

## Applications

Probability underlies statistics, insurance pricing, weather forecasting, medical trials, financial modeling, AI/machine learning, and game theory.`,
    summary: 'Probability measures how likely an event is, on a scale from 0 (impossible) to 1 (certain). P(event) = favorable outcomes / total outcomes for equally likely cases.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 16,
    updatedAt: now - 86400 * 2,
    sources: [
      { name: 'Khan Academy', title: 'Basic Probability', url: 'https://www.khanacademy.org/math/statistics-probability/probability-library' },
    ],
    tags: ['probability', 'statistics', 'mathematics', 'chance'],
    category: 'Mathematics',
    related: ['Statistics', 'Random Variables', 'Bayesian Probability'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-mathematical-function',
    title: 'What Is a Mathematical Function?',
    subject: 'what-is-a-mathematical-function',
    question: 'What is a mathematical function?',
    content: `A **mathematical function** is a rule that assigns exactly one output to each input.

## Formal Definition

A function f from set A to set B (written f: A → B) assigns to each element in A exactly one element in B.

- The set of inputs is the **domain**
- The set of possible outputs is the **codomain** (or range)
- Each input-output pair is written f(x) = y

## The Key Rule

Every input must map to **exactly one** output. The same input cannot give two different outputs. (But two inputs can give the same output.)

## Examples

- f(x) = x² maps every real number to its square: f(3) = 9, f(−3) = 9
- f(x) = 2x + 1 is a linear function: f(0) = 1, f(5) = 11
- f(x) = √x is only defined for x ≥ 0

## Function Notation

f(x) is read "f of x." The x is the input variable. We can use any letter.

## Types of Functions

- **Linear**: f(x) = mx + b
- **Quadratic**: f(x) = ax² + bx + c
- **Exponential**: f(x) = aˣ
- **Logarithmic**: f(x) = log(x)
- **Trigonometric**: sin(x), cos(x), etc.

## Why Functions Matter

Functions are the fundamental building block of calculus, physics, computer science (where they describe algorithms), and virtually all of modern mathematics.`,
    summary: 'A function assigns exactly one output to each input. Written f(x), functions are the fundamental building block of algebra, calculus, and computer science.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 14,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'Khan Academy', title: 'Intro to Functions', url: 'https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:functions' },
    ],
    tags: ['functions', 'mathematics', 'algebra', 'calculus'],
    category: 'Mathematics',
    related: ['Algebra', 'Calculus', 'Domain and Range'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },

  // ===== HISTORY =====
  {
    id: 'demo-renaissance',
    title: 'What Was the Renaissance?',
    subject: 'what-was-the-renaissance',
    question: 'What was the Renaissance?',
    content: `The **Renaissance** (French for "rebirth") was a cultural and intellectual movement that began in Italy during the 14th century and spread across Europe through the 17th century.

## What Was "Reborn"?

The Renaissance was marked by a renewed interest in the art, literature, and philosophy of ancient Greece and Rome — knowledge that had been largely marginalized during the medieval period in Western Europe.

## Key Characteristics

- **Humanism**: A philosophical emphasis on human potential, individual achievement, and reason rather than religious doctrine alone
- **Realism in art**: Perspective, anatomy, and naturalism replaced the flat symbolic art of the Middle Ages
- **Scientific inquiry**: Observation and experimentation began to challenge received wisdom
- **Vernacular literature**: Writers like Dante, Petrarch, and Boccaccio wrote in Italian rather than Latin

## Major Figures

- **Leonardo da Vinci** — painter, scientist, engineer ("The Last Supper," "Mona Lisa")
- **Michelangelo** — sculptor and painter (Sistine Chapel ceiling, "David")
- **Raphael** — painter ("The School of Athens")
- **Galileo Galilei** — astronomer and physicist
- **Nicolaus Copernicus** — heliocentric solar system model

## The Printing Press

Johannes Gutenberg's movable type printing press (c. 1440) rapidly spread Renaissance ideas across Europe, making books affordable and literacy more widespread.

## Legacy

The Renaissance laid the groundwork for the Scientific Revolution, the Reformation, and eventually the Enlightenment.`,
    summary: 'The Renaissance (14th–17th c.) was a cultural rebirth of classical Greek and Roman knowledge beginning in Italy, marked by humanism, realistic art, and scientific inquiry.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 27,
    updatedAt: now - 86400 * 6,
    sources: [
      { name: 'Britannica', title: 'Renaissance', url: 'https://www.britannica.com/event/Renaissance' },
      { name: 'Khan Academy', title: 'Renaissance Art', url: 'https://www.khanacademy.org/humanities/renaissance-reformation' },
    ],
    tags: ['renaissance', 'history', 'art', 'humanism', 'italy', 'europe'],
    category: 'History',
    related: ['Scientific Revolution', 'Protestant Reformation', 'Leonardo da Vinci'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-american-revolution',
    title: 'What Caused the American Revolution?',
    subject: 'what-caused-the-american-revolution',
    question: 'What caused the American Revolution?',
    content: `The American Revolution (1775–1783) had multiple interconnected causes rooted in political philosophy, economic grievances, and growing colonial identity.

## Taxation Without Representation

Britain imposed a series of taxes on the colonies after the expensive French and Indian War (1754–1763):
- **Stamp Act (1765)**: Tax on printed materials
- **Townshend Acts (1767)**: Duties on imported goods
- **Tea Act (1773)**: Led to the Boston Tea Party

Colonists objected that they were being taxed by a Parliament in which they had no elected representatives.

## Enlightenment Ideas

Thinkers like John Locke argued that government derives its authority from the consent of the governed and that people have the right to revolt against tyranny. Thomas Jefferson drew heavily on these ideas in the Declaration of Independence.

## Growing Colonial Identity

By 1775, many American-born colonists identified more as "Americans" than as British subjects. They had developed their own assemblies, legal traditions, and economic interests.

## Immediate Triggers

- The Intolerable Acts (1774) — punitive legislation after the Boston Tea Party
- The Boston Massacre (1770)
- Battles of Lexington and Concord (April 1775) — the "shot heard round the world"

## Outcome

Britain recognized American independence in the Treaty of Paris (1783). The U.S. Constitution (1787) established a republic based on the principles the Revolution had championed.`,
    summary: 'The American Revolution was caused by taxation without representation, Enlightenment political philosophy, growing colonial identity, and escalating British punitive measures.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 24,
    updatedAt: now - 86400 * 5,
    sources: [
      { name: 'Britannica', title: 'American Revolution', url: 'https://www.britannica.com/event/American-Revolution' },
      { name: 'National Archives', title: 'Declaration of Independence', url: 'https://www.archives.gov/founding-docs/declaration' },
    ],
    tags: ['american-revolution', 'history', 'usa', 'colonial', 'independence'],
    category: 'History',
    related: ['Declaration of Independence', 'Enlightenment', 'French and Indian War'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-roman-empire-decline',
    title: 'Why Did the Roman Empire Decline?',
    subject: 'why-did-the-roman-empire-decline',
    question: 'Why did the Roman Empire decline?',
    content: `The decline of the Western Roman Empire was a gradual process spanning centuries, with historians identifying multiple contributing causes.

## Military and Political Factors

- **Military overstretching**: The empire became too large to defend with the standing army
- **Political instability**: Between 235–284 CE (the "Crisis of the Third Century"), Rome had over 50 emperors — many assassinated
- **Civil wars**: Constant internal conflict drained resources and damaged infrastructure
- **Reliance on mercenaries**: The Roman army increasingly relied on Germanic foederati whose loyalties were divided

## Economic Problems

- Heavy taxation to fund military campaigns impoverished citizens
- Inflation from currency debasement (reducing silver content in coins)
- Disruption of trade routes
- Decline of the slave economy

## External Pressures

- Increasing raids by Germanic peoples: Visigoths, Vandals, Huns
- The Hunnic invasions destabilized Germanic peoples westward into Roman territory

## Other Factors

- **Disease**: The Antonine Plague (165–180 CE) and Plague of Cyprian (249–262 CE) killed millions
- **Administrative division**: Splitting into East and West (285 CE) weakened the West
- **The role of Christianity**: Debated — Edward Gibbon famously argued it redirected Roman energy from civic life; others dispute this

## The End

The conventional date for the fall of the Western Roman Empire is **476 CE**, when the Germanic chieftain Odoacer deposed the last Western emperor, Romulus Augustulus.`,
    summary: 'Rome\'s decline resulted from military overextension, political instability, economic crisis, Germanic invasions, and disease — a multi-century process ending in 476 CE.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 21,
    updatedAt: now - 86400 * 4,
    sources: [
      { name: 'Britannica', title: 'Fall of Rome', url: 'https://www.britannica.com/story/8-reasons-why-rome-fell' },
    ],
    tags: ['roman-empire', 'history', 'ancient-rome', 'fall-of-rome', 'decline'],
    category: 'History',
    related: ['Byzantine Empire', 'Germanic Migrations', 'Medieval Europe'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-silk-road',
    title: 'What Was the Silk Road?',
    subject: 'what-was-the-silk-road',
    question: 'What was the Silk Road?',
    content: `The **Silk Road** was an ancient network of trade routes connecting China and East Asia with Central Asia, South Asia, the Middle East, and Europe, active from roughly the 2nd century BCE to the 15th century CE.

## Not a Single Road

Despite the singular name, the Silk Road was actually a web of overland and maritime routes. Goods rarely traveled the entire length — instead, they were bought and sold through a series of intermediaries.

## What Was Traded?

The name comes from Chinese silk — a luxury good that only China knew how to produce for centuries. Other goods included:
- **Eastward**: gold, silver, glassware, wool, ivory, spices
- **Westward**: silk, porcelain, paper, gunpowder, spices from Southeast Asia

## Beyond Commerce

The Silk Road was as much a conduit for ideas as for goods:
- **Buddhism** spread from India into Central and East Asia
- **Islam** spread through Central Asian trade networks
- **Paper and printing** technologies traveled west from China
- **Mathematics**, astronomical knowledge, and art crossed borders

## The Black Death

The Silk Road is also associated with the spread of the Bubonic Plague in the 14th century — which devastated both Asia and Europe.

## Decline

The fall of the Mongol Empire (which had unified much of the route) and the opening of sea trade routes by European explorers in the 15th century contributed to the Silk Road's decline.`,
    summary: 'The Silk Road was an ancient trade network (2nd c. BCE–15th c. CE) connecting Asia and Europe, transmitting goods, religions, technologies, and diseases.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 17,
    updatedAt: now - 86400 * 2,
    sources: [
      { name: 'National Geographic', title: 'Silk Road', url: 'https://www.nationalgeographic.com/history/article/silk-road' },
    ],
    tags: ['silk-road', 'history', 'trade', 'china', 'ancient'],
    category: 'History',
    related: ['Mongol Empire', 'Buddhist Spread', 'Trade Routes'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-ww1-causes',
    title: 'What Caused World War I?',
    subject: 'what-caused-world-war-i',
    question: 'What caused World War I?',
    content: `World War I (1914–1918) resulted from a combination of long-term structural tensions and a short-term crisis that set them off.

## Long-Term Causes (MAIN)

**Militarism**: European powers had spent decades building up massive armies and competing for military superiority.

**Alliances**: Europe was divided into two main blocs — the Triple Alliance (Germany, Austria-Hungary, Italy) and the Triple Entente (France, Russia, Britain). An attack on one member meant war with all.

**Imperialism**: Competition for colonies and global influence created friction, especially between Britain, France, and Germany.

**Nationalism**: Strong ethnic nationalist movements — especially in the Austro-Hungarian and Ottoman Empires — destabilized borders.

## The Immediate Trigger

On June 28, 1914, Archduke Franz Ferdinand, heir to the Austro-Hungarian throne, was assassinated in Sarajevo by Gavrilo Princip, a Bosnian Serb nationalist.

Austria-Hungary blamed Serbia and issued an ultimatum. Serbia's partial non-compliance triggered Austria-Hungary to declare war. The alliance system then pulled in Russia, Germany, France, and Britain in rapid succession — within six weeks, most of Europe was at war.

## The Chain Reaction

1. Austria-Hungary declares war on Serbia
2. Russia mobilizes to defend Serbia
3. Germany declares war on Russia (and France)
4. Germany invades Belgium (per the Schlieffen Plan)
5. Britain declares war on Germany (treaty obligation to Belgium)

The war lasted four years and killed approximately 20 million people.`,
    summary: 'WW1 was caused by militarism, alliances, imperialism, and nationalism — set off by the assassination of Archduke Franz Ferdinand in 1914, which triggered the alliance system.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 13,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'Britannica', title: 'World War I', url: 'https://www.britannica.com/event/World-War-I' },
    ],
    tags: ['world-war-1', 'history', 'ww1', 'great-war', 'europe'],
    category: 'History',
    related: ['Treaty of Versailles', 'World War II', 'Archduke Franz Ferdinand'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },

  // ===== TECHNOLOGY =====
  {
    id: 'demo-internet',
    title: 'What Is the Internet?',
    subject: 'what-is-the-internet',
    question: 'What is the Internet?',
    content: `The **Internet** is a global system of interconnected computer networks that communicate using standardized protocols — primarily the **TCP/IP** protocol suite.

## Origins

The Internet evolved from **ARPANET**, a U.S. Defense Department research network created in 1969 that first demonstrated packet-switching — breaking data into packets and routing them independently across a network.

## How It Works

**Packet switching**: Data is broken into small packets. Each packet may travel a different route and is reassembled at the destination.

**TCP/IP**: Two key protocols:
- **IP (Internet Protocol)**: Addresses and routes packets to the correct destination
- **TCP (Transmission Control Protocol)**: Ensures all packets arrive and are reassembled correctly

**DNS (Domain Name System)**: Translates human-readable addresses (like google.com) into numeric IP addresses.

## The World Wide Web

Many people confuse the Internet with the **World Wide Web** (WWW). They are different:
- The **Internet** is the physical and logical infrastructure (cables, routers, protocols)
- The **Web** is a service that runs *on top of* the Internet — websites accessed via HTTP

Email, streaming, gaming, and many other services also run on the Internet but are not part of the Web.

## Scale

As of the mid-2020s, the Internet connects approximately 5 billion users, over 1 billion websites, and an estimated 15+ billion devices.`,
    summary: 'The Internet is a global network of interconnected computers using TCP/IP protocols. It evolved from ARPANET (1969) and is the infrastructure the World Wide Web runs on.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 26,
    updatedAt: now - 86400 * 5,
    sources: [
      { name: 'Internet Society', title: 'Brief History of the Internet', url: 'https://www.internetsociety.org/internet/history-internet/brief-history-internet/' },
    ],
    tags: ['internet', 'technology', 'networking', 'tcp-ip', 'arpanet'],
    category: 'Technology',
    related: ['World Wide Web', 'TCP/IP', 'DNS', 'ARPANET'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-algorithm',
    title: 'What Is an Algorithm?',
    subject: 'what-is-an-algorithm',
    question: 'What is an algorithm?',
    content: `An **algorithm** is a finite, step-by-step procedure for solving a problem or completing a task.

## Key Properties

A valid algorithm must be:
1. **Finite**: It must terminate after a finite number of steps
2. **Definite**: Each step must be precisely defined
3. **Input**: It accepts zero or more inputs
4. **Output**: It produces at least one output
5. **Effective**: Each step must be feasible

## Everyday Examples

- A recipe is an algorithm for cooking food
- Long division is an algorithm for dividing large numbers
- A knitting pattern is an algorithm for making clothing

## In Computer Science

Algorithms are the fundamental building blocks of software. Common algorithms include:

- **Sorting**: Arranging data in order (bubble sort, quicksort, merge sort)
- **Searching**: Finding an element in data (binary search, hash tables)
- **Pathfinding**: Finding the shortest route (Dijkstra's algorithm, A*)
- **Compression**: Reducing file sizes (Huffman coding)
- **Encryption**: Securing data (AES, RSA)

## Algorithm Efficiency

Algorithms are evaluated by:
- **Time complexity**: How runtime grows with input size (Big O notation)
- **Space complexity**: Memory requirements

O(log n) is much faster than O(n²) for large datasets.

## The Word's Origin

"Algorithm" comes from the name of the 9th-century Persian mathematician **Al-Khwarizmi**, whose books introduced algebra and decimal arithmetic to Europe.`,
    summary: 'An algorithm is a finite, step-by-step procedure for solving a problem. In computing, algorithms are the fundamental logic behind all software.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 23,
    updatedAt: now - 86400 * 4,
    sources: [
      { name: 'Khan Academy', title: 'Algorithms Overview', url: 'https://www.khanacademy.org/computing/computer-science/algorithms' },
    ],
    tags: ['algorithm', 'computer-science', 'technology', 'programming'],
    category: 'Technology',
    related: ['Data Structures', 'Big O Notation', 'Machine Learning'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-encryption',
    title: 'How Does Encryption Work?',
    subject: 'how-does-encryption-work',
    question: 'How does encryption work?',
    content: `**Encryption** is the process of converting readable data (plaintext) into an unreadable format (ciphertext) so that only authorized parties with the correct key can read it.

## The Basic Concept

Think of encryption like a combination lock:
- The **message** is what you want to protect
- The **algorithm** is the locking mechanism
- The **key** is the combination needed to unlock it

## Symmetric Encryption

Uses the **same key** to encrypt and decrypt.

- **Fast** and efficient for large data
- Problem: How do you securely share the key?
- Examples: AES (Advanced Encryption Standard), used in file encryption and HTTPS

## Asymmetric (Public-Key) Encryption

Uses a **key pair**:
- A **public key** (shared openly) to encrypt
- A **private key** (kept secret) to decrypt

Anyone can send you an encrypted message using your public key, but only you can decrypt it with your private key.

- Examples: RSA, Elliptic Curve Cryptography (ECC)
- Used in: HTTPS, email, digital signatures, cryptocurrency

## HTTPS

When you visit a website with a padlock (HTTPS):
1. Your browser and server perform a **TLS handshake** using asymmetric encryption to exchange keys
2. The actual web traffic is then encrypted with fast symmetric encryption (AES)

## Hashing

Related but different: **hashing** is a one-way process that produces a fixed-length fingerprint of data. It cannot be reversed. Used for storing passwords and verifying file integrity (SHA-256, bcrypt).`,
    summary: 'Encryption converts data into unreadable ciphertext using a key. Symmetric encryption uses one key; asymmetric uses public/private key pairs. HTTPS combines both.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 20,
    updatedAt: now - 86400 * 3,
    sources: [
      { name: 'EFF', title: 'What Is Encryption?', url: 'https://ssd.eff.org/module/what-should-i-know-about-encryption' },
      { name: 'Cloudflare', title: 'What Is Encryption?', url: 'https://www.cloudflare.com/learning/ssl/what-is-encryption/' },
    ],
    tags: ['encryption', 'cryptography', 'technology', 'security', 'aes', 'rsa'],
    category: 'Technology',
    related: ['HTTPS', 'Public-Key Cryptography', 'Hashing', 'TLS'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-artificial-intelligence',
    title: 'What Is Artificial Intelligence?',
    subject: 'what-is-artificial-intelligence',
    question: 'What is artificial intelligence?',
    content: `**Artificial Intelligence (AI)** is the field of computer science concerned with building systems that can perform tasks that typically require human intelligence.

## What Counts as "Intelligence"?

Benchmarks that AI has historically targeted include:
- Understanding natural language
- Recognizing images and objects
- Playing strategic games (chess, Go)
- Generating text, images, and code
- Making decisions under uncertainty
- Translating between languages

## Narrow vs. General AI

- **Narrow AI** (ANI): Designed for one specific task (e.g., face recognition, spam filtering, playing chess). All current commercial AI is narrow AI.
- **General AI** (AGI): A hypothetical system with human-level reasoning across all domains. Does not yet exist.

## Machine Learning

Modern AI is dominated by **machine learning** — systems that learn patterns from data rather than following explicitly programmed rules.

**Deep learning** is a subset of machine learning using neural networks with many layers. It powers:
- Large language models (like ChatGPT, Claude)
- Image recognition
- Voice assistants

## Large Language Models (LLMs)

LLMs are trained on vast text corpora to predict the next word in a sequence. They can answer questions, write, reason, and generate code — but they don't "understand" in the human sense. They learn statistical patterns.

## Key Limitations

AI systems can:
- Hallucinate (produce confident but false statements)
- Reflect biases in training data
- Fail in unexpected situations outside their training distribution`,
    summary: 'AI is the field of building systems that perform tasks requiring human intelligence. Modern AI uses machine learning — especially deep learning — to learn from data rather than explicit rules.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 12,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'Stanford HAI', title: 'Artificial Intelligence Index Report', url: 'https://aiindex.stanford.edu/' },
    ],
    tags: ['artificial-intelligence', 'machine-learning', 'deep-learning', 'llm', 'technology'],
    category: 'Technology',
    related: ['Machine Learning', 'Neural Networks', 'Large Language Models'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
  {
    id: 'demo-search-engine',
    title: 'How Does a Search Engine Work?',
    subject: 'how-does-a-search-engine-work',
    question: 'How does a search engine work?',
    content: `A search engine indexes the web and retrieves the most relevant results for a user's query in milliseconds. It works in three main phases:

## 1. Crawling

**Web crawlers** (also called spiders or bots) systematically browse the web, following links from page to page.
- They start from a known list of URLs
- Download each page's content
- Follow links found on each page to discover new pages
- Re-visit pages periodically to detect updates

Google's crawler is called **Googlebot**.

## 2. Indexing

Crawled content is processed and stored in a massive **search index** — essentially a huge database mapping words to the pages that contain them.

During indexing, the search engine:
- Parses HTML to extract text and metadata
- Analyzes the words and their context
- Identifies canonical URLs (to avoid duplicates)
- Stores information about links (which pages link to which)

## 3. Ranking

When a user enters a query, the search engine:
1. Looks up relevant pages in the index
2. **Ranks** them using hundreds of signals:
   - Keyword relevance and placement
   - Page authority (based on links — Google's **PageRank**)
   - Content quality and freshness
   - User experience signals (mobile-friendly, speed)
   - Personalization (location, search history)
3. Returns the ranked list as search results

## Modern Additions

Today's search engines also use AI to:
- Understand query intent (not just keywords)
- Summarize answers directly in results
- Handle natural language questions`,
    summary: 'Search engines work in three phases: crawling (discovering web pages), indexing (storing content), and ranking (selecting the most relevant results for a query).',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 10,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'Google', title: 'How Search Works', url: 'https://www.google.com/search/howsearchworks/' },
    ],
    tags: ['search-engine', 'technology', 'web-crawling', 'indexing', 'pagerank'],
    category: 'Technology',
    related: ['PageRank', 'SEO', 'Web Crawlers', 'Information Retrieval'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },

  // ===== NATURE =====
  {
    id: 'demo-black-holes',
    title: 'What Is a Black Hole?',
    subject: 'what-is-a-black-hole',
    question: 'What is a black hole?',
    content: `A **black hole** is a region of space where gravity is so strong that nothing — not even light — can escape once it crosses the boundary called the **event horizon**.

## Formation

Most black holes form when massive stars (more than ~20 times the mass of the Sun) exhaust their nuclear fuel and collapse under their own gravity in a supernova explosion. The core collapses to a point of infinite density called a **singularity**.

## Structure

- **Singularity**: The theoretical point at the center where density becomes infinite and known physics breaks down
- **Event horizon**: The "point of no return" — the boundary where escape velocity equals the speed of light
- **Accretion disk**: Swirling material falling toward the black hole, heated to extreme temperatures and emitting X-rays

## Types

- **Stellar black holes**: A few to tens of solar masses, formed from collapsed stars
- **Supermassive black holes**: Millions to billions of solar masses, found at the centers of most large galaxies (including the Milky Way's **Sagittarius A***, ~4 million solar masses)
- **Intermediate**: Theorized between stellar and supermassive sizes

## Can We See Them?

Not directly — but we can detect them by their effects:
- Gravitational lensing of light
- Motion of nearby stars
- X-ray emissions from accretion disks
- Gravitational waves (from mergers)

In 2019, the Event Horizon Telescope captured the first image of a black hole's shadow (M87*).`,
    summary: 'A black hole is a region of space where gravity prevents even light from escaping. Most form from collapsed massive stars. The boundary is called the event horizon.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 11,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'NASA', title: 'Black Holes', url: 'https://www.nasa.gov/universe/black-holes/' },
    ],
    tags: ['black-holes', 'astronomy', 'space', 'gravity', 'physics'],
    category: 'Science',
    related: ['Event Horizon', 'Neutron Stars', 'Gravitational Waves'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },

  // ===== PHILOSOPHY =====
  {
    id: 'demo-scientific-method',
    title: 'What Is the Scientific Method?',
    subject: 'what-is-the-scientific-method',
    question: 'What is the scientific method?',
    content: `The **scientific method** is a systematic approach to understanding the natural world through observation, hypothesis formation, experimentation, and peer review.

## The Core Steps

1. **Observation**: Notice a phenomenon or problem in the natural world
2. **Question**: Formulate a specific, answerable question about it
3. **Hypothesis**: Propose a testable explanation (an "if...then..." prediction)
4. **Experiment**: Design a controlled test to evaluate the hypothesis
5. **Data collection**: Record results carefully and objectively
6. **Analysis**: Interpret the data using statistics and reasoning
7. **Conclusion**: Determine whether the data support or refute the hypothesis
8. **Publication and peer review**: Share findings for scrutiny by other scientists

## Key Principles

**Falsifiability** (Karl Popper): A scientific hypothesis must make predictions that could theoretically be proven wrong. If a claim can't be tested or falsified, it isn't science.

**Reproducibility**: Other scientists must be able to repeat the experiment and obtain the same results.

**Peer review**: Before publication, other qualified scientists scrutinize the methods, data, and conclusions.

## Theories vs. Laws

In science:
- A **theory** is a well-substantiated explanation supported by extensive evidence (evolution, relativity, germ theory)
- A **law** is a descriptive statement of observed regularity (Newton's laws, Boyle's law)

Scientific theories are NOT guesses — they are the highest form of scientific explanation.`,
    summary: 'The scientific method is a systematic approach: observe, hypothesize, experiment, analyze, and publish for peer review. Falsifiability and reproducibility are its core principles.',
    author: DEMO_CONTRIBUTOR,
    createdAt: now - 86400 * 9,
    updatedAt: now - 86400 * 1,
    sources: [
      { name: 'Nature', title: 'What Is the Scientific Method?', url: 'https://www.nature.com/' },
    ],
    tags: ['scientific-method', 'science', 'philosophy', 'empiricism', 'falsifiability'],
    category: 'Science',
    related: ['Hypothesis Testing', 'Peer Review', 'Karl Popper'],
    evidenceStatus: 'sufficient',
    isDemo: true,
  },
];

// Build a lookup index
export const DEMO_INDEX = new Map<string, KnowledgeArticle>(
  DEMO_ARTICLES.map(a => [a.id, a])
);

export const DEMO_BY_SUBJECT = new Map<string, KnowledgeArticle>(
  DEMO_ARTICLES.map(a => [a.subject, a])
);
