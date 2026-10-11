# Container System Design

## Philosophy: Intentional Rhythm-Based Layout

Inspired by modern design systems (Stripe, Linear, Vercel), our container system uses **semantic tokens** instead of arbitrary widths to create visual hierarchy and consistency.

---

## Container Tokens

| Token               | Width                 | Purpose                    | Use Cases                                     |
| ------------------- | --------------------- | -------------------------- | --------------------------------------------- |
| `container-prose`   | **960px** (60rem)     | Long-form text readability | Blog posts, documentation, article content    |
| `container-content` | **1280px** (80rem)    | Default balanced layout    | Forms, card grids (2-col), standard sections  |
| `container-wide`    | **1440px** (90rem)    | Spacious feature sections  | Hero sections, 3-col grids, feature showcases |
| Full-width          | **100%** with padding | Edge-to-edge visual impact | Background images, full-bleed media           |

---

## Design Decisions

### 1. **Visual Alignment Strategy**

Sections use **two alternating widths** to create rhythm:

- **Wide (1440px):** Hero text, Cards grid
- **Content (1280px):** Text-heavy sections (Layanan)
- **Full-bleed with constraint:** Hero image (1600px max)

```
Visual Rhythm (1920px viewport):

Hero Text (wide):     [---240px---][======1440px======][---240px---]
Hero Image (full):    [---160px---][========1600px========][---160px---]
Layanan (content):    [---320px---][====1280px====][---320px---]
Cards (wide):         [---240px---][======1440px======][---240px---]
                      ^^^^ Intentional offset = depth ^^^^
```

This creates **"breakout" design** — not broken, but intentional visual hierarchy.

---

### 2. **Hero Image: Aspect Ratio Optimization**

**Problem:** Standard `aspect-video` (16:9) at 1600px = 900px height  
**Solution:** `aspect-[21/9]` (wider cinematic ratio)

**Math:**

- 1600px @ 21:9 = **686px height** (vs. 900px)
- Above-the-fold budget: Navbar (64) + Hero Text (380) + Image (686) = **1130px**
- Fits 1080p screens with only 50px scroll → **Acceptable UX**

---

### 3. **Card Grid Optimization**

**3-Column Layout Math:**

| Container    | Available Width              | Per Card  | Gain     |
| ------------ | ---------------------------- | --------- | -------- |
| Old (1280px) | 1280 - 48px padding = 1232px | ~410px    | baseline |
| New (1440px) | 1440 - 48px padding = 1392px | **464px** | **+13%** |

**Result:** Meaningful improvement in card breathing room, especially for card images.

---

## Usage Guidelines

### ✅ When to Use Each Container

**`container-prose` (960px):**

```tsx
// Long paragraphs, blog content
<article className="container-prose">
  <h1>Article Title</h1>
  <p>Long paragraph text...</p>
</article>
```

**`container-content` (1280px):**

```tsx
// Default sections, 2-col layouts, forms
<section className="container-content">
  <div className="grid grid-cols-2 gap-8">{/* Balanced content */}</div>
</section>
```

**`container-wide` (1440px):**

```tsx
// Hero sections, 3-col grids, feature showcases
<section className="container-wide">
  <div className="grid grid-cols-3 gap-6">{/* Feature cards */}</div>
</section>
```

**Full-width with constraint:**

```tsx
// Hero images, full-bleed backgrounds
<section className="w-full px-4 sm:px-6">
  <div className="mx-auto max-w-[1600px]">
    <img src="..." className="w-full aspect-[21/9]" />
  </div>
</section>
```

---

## Responsive Behavior

All containers maintain consistent padding across breakpoints:

```css
px-4        /* 16px - mobile */
sm:px-6     /* 24px - tablet (640px+) */
lg:px-8     /* 32px - desktop (1024px+) */
```

This ensures content never touches screen edges while maximizing usable width.

---

## Migration Guide

### Old Pattern (Inconsistent):

```tsx
<section className="container mx-auto max-w-7xl px-4 sm:px-6">
<section className="container mx-auto max-w-[1440px] px-4 sm:px-6">
```

### New Pattern (Semantic):

```tsx
<section className="container-content">
<section className="container-wide">
```

---

## Maintenance

**When to Add New Tokens:**

- Only when there's a **clear semantic need** (e.g., `container-narrow` for sidebars)
- Never add arbitrary widths like `1350px` or `1520px`
- Keep system to **3-4 tiers maximum** for maintainability

**When to Use Custom Width:**

- Hero image max-constraint (`max-w-[1600px]`) is acceptable because it's a **single breakout exception**
- Documented in this file with clear reasoning

---

## References

- **Stripe:** Uses 1200px default, 1440px wide
- **Linear:** Uses 1280px content, full-bleed heroes
- **Vercel:** Uses breakout sections with ~1400px wide tier
- **Typographic Scale:** 45-75 characters per line rule applies to `container-prose`

---

**Last Updated:** 2026-07-29  
**Owner:** IFLab Design System
