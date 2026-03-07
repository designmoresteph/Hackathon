# mymind Design System
*Extracted & translated to free Google Fonts equivalents*

---

## 🎨 COLOR PALETTE

### Core Colors
```css
--white:        #FFFFFF   /* Primary background — pure, uncompromising */
--off-white:    #F7F5F0   /* Warm page background, paper-like */
--cream:        #F2EFE9   /* Card backgrounds, subtle separation */
--black:        #0D0D0D   /* Headings, primary text — near black not pure */
--dark:         #1A1A1A   /* Body text */
--mid-gray:     #6B6B6B   /* Secondary text, captions */
--light-gray:   #E8E5E0   /* Borders, dividers */
--muted:        #A8A49E   /* Placeholder text, tertiary */
```

### Accent Colors
```css
--yellow:       #F5E642   /* CTA buttons, highlights — warm lemon not neon */
--yellow-hover: #EDD800   /* Button hover state */
--peach:        #F5C4A1   /* Soft warm accent, illustration tones */
--sage:         #C8D5B0   /* Nature/calm accent */
--blush:        #F0D5D0   /* Soft pink for warmth */
```

### Semantic
```css
--text-primary:   #0D0D0D
--text-secondary: #6B6B6B
--text-muted:     #A8A49E
--bg-primary:     #F7F5F0
--bg-card:        #FFFFFF
--border:         #E8E5E0
--cta:            #F5E642
```

---

## 🔤 TYPOGRAPHY

### mymind Original Fonts
- **Display/Headings:** Custom serif — warm, humanist, editorial
- **Body:** Clean grotesque sans — neutral, readable
- **Labels/Nav:** Small caps grotesque, tracked out

### 🆓 Google Fonts Lookalikes

| Role | mymind Feel | Google Fonts Alternative | Import |
|------|-------------|--------------------------|--------|
| **Hero display** | Warm editorial serif | `Playfair Display` | ✅ Free |
| **Section headings** | Humanist serif, medium weight | `Lora` | ✅ Free |
| **Body text** | Clean, neutral grotesque | `DM Sans` | ✅ Free |
| **UI labels / nav** | Small, tracked, geometric | `DM Mono` or `Outfit` | ✅ Free |
| **Manifesto / poetic text** | Italic serif, expressive | `Cormorant Garamond` italic | ✅ Free |
| **Button text** | Compact, uppercase, tracked | `Outfit` 600 | ✅ Free |

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type Scale
```css
/* Hero headline */
font-family: 'Playfair Display', serif;
font-size: clamp(48px, 7vw, 96px);
font-weight: 400;
line-height: 1.05;
letter-spacing: -0.02em;

/* Section heading */
font-family: 'Lora', serif;
font-size: clamp(28px, 4vw, 48px);
font-weight: 400;
line-height: 1.2;
letter-spacing: -0.01em;

/* Body */
font-family: 'DM Sans', sans-serif;
font-size: 17px;
font-weight: 300;
line-height: 1.7;
letter-spacing: 0;

/* Labels / eyebrow text */
font-family: 'Outfit', sans-serif;
font-size: 11px;
font-weight: 600;
letter-spacing: 0.12em;
text-transform: uppercase;

/* Manifesto / poetic */
font-family: 'Cormorant Garamond', serif;
font-style: italic;
font-size: clamp(22px, 3vw, 38px);
font-weight: 300;
line-height: 1.5;
```

---

## 📐 SPACING SYSTEM

mymind uses **generous, breathing whitespace** — almost uncomfortably spacious.

```css
/* Base unit: 8px */
--space-xs:   8px
--space-sm:   16px
--space-md:   24px
--space-lg:   48px
--space-xl:   80px
--space-2xl:  120px
--space-3xl:  160px
--space-4xl:  200px   /* Section padding on desktop */

/* Section vertical rhythm */
padding-top: clamp(80px, 12vw, 200px);
padding-bottom: clamp(80px, 12vw, 200px);

/* Content max-width */
--max-width: 1200px;
--content-width: 760px;   /* Text columns never go full width */
--narrow-width: 560px;    /* Manifesto / centered text */

/* Horizontal padding */
padding-inline: clamp(24px, 6vw, 80px);
```

### Grid
```css
/* Cards / features grid */
display: grid;
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 24px;

/* Two-col layout */
grid-template-columns: 1fr 1fr;
gap: 48px;
align-items: center;
```

---

## 🃏 CARDS & SURFACES

```css
/* Feature card */
background: #FFFFFF;
border-radius: 16px;
padding: 32px;
border: 1px solid #E8E5E0;
box-shadow: none;   /* mymind almost never uses drop shadows */

/* Subtle elevation (used sparingly) */
box-shadow: 0 2px 20px rgba(0,0,0,0.06);

/* Image cards — masonry-style, no uniform height */
border-radius: 12px;
overflow: hidden;
```

---

## 🔘 BUTTONS

```css
/* Primary CTA */
background: #F5E642;
color: #0D0D0D;
border: none;
border-radius: 100px;   /* Pill shape */
padding: 14px 28px;
font-family: 'Outfit', sans-serif;
font-size: 13px;
font-weight: 600;
letter-spacing: 0.08em;
text-transform: uppercase;
cursor: pointer;
transition: background 0.2s ease;

/* Hover */
background: #EDD800;

/* Ghost / secondary */
background: transparent;
border: 1.5px solid #0D0D0D;
color: #0D0D0D;
border-radius: 100px;
padding: 12px 24px;

/* Text link with arrow */
font-family: 'Outfit', sans-serif;
font-size: 12px;
font-weight: 600;
letter-spacing: 0.1em;
text-transform: uppercase;
text-decoration: none;
display: flex;
align-items: center;
gap: 8px;
```

---

## 🎨 GRAPHIC LANGUAGE

### Key Visual Principles
- **No drop shadows** — flat, honest, paper-like
- **No gradients on backgrounds** — solid, clean colors only
- **Rounded corners everywhere** — 12px cards, 100px buttons
- **Masonry/organic layouts** — cards aren't all the same height
- **Illustrations over photography** — hand-drawn feel, SVG figures
- **Lots of white space** — content breathes, nothing crowds

### Illustration Style
```
- Simple, organic SVG line drawings
- Warm palette: creams, yellows, peach, sage
- Human figures: simple, gender-neutral, expressive gestures
- No gradients in illustrations — flat fills only
- Stroke weight: consistent 1.5–2px
- Rounded line caps and joins
```

### Icons
```css
/* Simple, single-weight line icons */
stroke-width: 1.5px;
stroke: currentColor;
fill: none;
border-radius: 2px on corners;
size: 20–24px UI, 40–48px feature icons
```

### Section Dividers
```css
/* mymind rarely uses lines — uses space instead */
/* When they do separate sections: */
border-top: 1px solid #E8E5E0;
margin: 0;

/* OR organic blob/shape separator — SVG wave */
```

---

## ✨ MOTION & ANIMATION

```css
/* Base transition — everything feels gentle */
transition: all 0.25s ease;

/* Hover states — subtle lift */
transform: translateY(-2px);
transition: transform 0.2s ease;

/* Fade in on scroll */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
animation: fadeUp 0.6s ease forwards;
animation-delay: calc(var(--i) * 0.1s);   /* stagger */

/* Image cards — slow subtle float */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-8px); }
}
animation: float 6s ease-in-out infinite;
```

---

## 🧭 NAVIGATION

```css
/* Minimal top nav */
position: sticky;
top: 0;
background: rgba(247, 245, 240, 0.9);
backdrop-filter: blur(12px);
padding: 20px clamp(24px, 6vw, 80px);
display: flex;
justify-content: space-between;
align-items: center;
z-index: 100;
border-bottom: none;   /* No border — floats above content */

/* Nav links */
font-family: 'Outfit', sans-serif;
font-size: 14px;
font-weight: 500;
color: #0D0D0D;
text-decoration: none;
letter-spacing: 0.01em;
gap: 40px;
```

---

## 🌟 THE ESSENCE

mymind's design communicates:
- **Calm** — through space, soft colors, gentle typography
- **Trust** — through restraint, no clutter, nothing screaming
- **Intelligence** — through editorial typography, confident layout
- **Warmth** — through cream backgrounds, yellow accents, organic illustrations
- **Privacy** — through minimal data visualization, no social metrics

The single most important rule: **when in doubt, add more space.**
