# Font Setup Guide

## Overview

This project uses a **dual font system**:

- **Inter** - For body text and general content
- **Playfair Display** - For headings and titles

## How It Works

### 1. Font Configuration (`app/layout.tsx`)

Both fonts are imported from Google Fonts with CSS variables:

```tsx
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Creates CSS variable
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair", // Creates CSS variable
});
```

### 2. Tailwind Configuration (`tailwind.config.ts`)

The fonts are registered in Tailwind's theme:

```typescript
fontFamily: {
  sans: ["var(--font-inter)", "sans-serif"],      // Default body font
  heading: ["var(--font-playfair)", "serif"],     // Heading font
}
```

## Usage Examples

### Body Text (Default)

Body text automatically uses Inter:

```tsx
<p>This text uses Inter font automatically</p>
<div>Regular content uses Inter by default</div>
```

### Headings

Use the `font-heading` class for headings:

```tsx
<h1 className="font-heading text-4xl font-bold">
  Main Title
</h1>

<h2 className="font-heading text-3xl font-semibold">
  Section Title
</h2>

<h3 className="font-heading text-2xl">
  Subsection
</h3>
```

### Explicitly Using Body Font

If you ever need to force body font:

```tsx
<span className="font-sans">This uses Inter explicitly</span>
```

## Changing Fonts

### Option 1: Change One Font

In `app/layout.tsx`, replace the font import:

```tsx
// Change body font
import { Roboto, Playfair_Display } from "next/font/google";
const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

// Or change heading font
import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-playfair",
});
```

### Option 2: Change Both Fonts

Replace both font imports and their configurations in `app/layout.tsx`.

### Option 3: Use Different Font Combinations

Some popular pairings:

- **Inter** + **Playfair Display** (current - modern + elegant)
- **Roboto** + **Montserrat** (clean + bold)
- **Lato** + **Merriweather** (friendly + readable)
- **Open Sans** + **Raleway** (neutral + stylish)

## Migration Strategy

To update existing components to use the heading font:

1. Find all heading elements (h1, h2, h3, etc.)
2. Add `font-heading` class:

   ```tsx
   // Before
   <h1 className="text-4xl font-bold">Title</h1>

   // After
   <h1 className="font-heading text-4xl font-bold">Title</h1>
   ```

3. Body text needs no changes - it uses Inter by default

## Best Practices

1. **Consistency**: Always use `font-heading` for headings (h1-h6)
2. **Body Text**: Let body text inherit the default (no need to add `font-sans`)
3. **Special Cases**: Use `font-heading` for prominent CTAs or feature text
4. **Performance**: Both fonts are optimized by Next.js font optimization

## Testing Your Changes

After changing fonts:

1. Check the homepage
2. Check dashboard pages
3. Check comparison pages
4. Verify heading hierarchy looks good
5. Test on mobile devices
