# ReviewLecturers - Design System Master (Claymorphism Edition)

> **CORE PRINCIPLE:** Every element should feel like it's made of soft, tactile clay or a bubbly marshmallow. No sharp corners. No harsh shadows. Soft transitions only.

---

## 1. Visual Identity & "The Vibe"

- **Primary Style:** Claymorphism / Bubbly / Glassmorphism (Soft)
- **Keywords:** Playful, Professional, Soft, Rounded, Friendly, Premium, Tactile.
- **Master Shape:** `border-radius: 24px` (or `rounded-3xl` in Tailwind). Avoid anything below 12px.

---

## 2. Color System (Consistent Across Web & Mobile)

### Light Mode (Pastel & Creamy)
| Role | Hex | Description |
|------|-----|-------------|
| **Primary** | `#6366F1` | Indigo Pastel - Main actions |
| **Secondary** | `#93C5FD` | Sky Blue - Soft accents |
| **Background** | `#F8FAFC` | Off-white/Creamy - Page base |
| **Surface** | `#FFFFFF` | Pure White - Card base |
| **Text Main** | `#1E293B` | Slate 800 - High legibility |
| **Text Sub** | `#64748B` | Slate 500 - Secondary info |

### Dark Mode (Deep & Glowing)
| Role | Hex | Description |
|------|-----|-------------|
| **Primary** | `#818CF8` | Lighter Indigo - Better contrast |
| **Background** | `#0F172A` | Deep Navy - Page base |
| **Surface** | `#1E293B` | Slate 800 - Card base |
| **Text Main** | `#F8FAFC` | Creamy white |
| **Text Sub** | `#94A3B8` | Muted slate |

---

## 3. The Claymorphism Formula

To achieve the "Clay" look, we use a combination of shadows:

### Web (Tailwind v4)
```css
.clay-card {
  @apply rounded-3xl bg-white dark:bg-slate-800 border border-white/20;
  /* Outer Shadow */
  box-shadow: 
    10px 10px 20px rgba(0, 0, 0, 0.05),
    -10px -10px 20px rgba(255, 255, 255, 0.8);
  /* Inner Highlight (The Secret Sauce) */
  @apply dark:shadow-none;
}
```

### Mobile (React Native)
```typescript
export const Shadows = {
  clay: {
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5, // Android fallback
    backgroundColor: '#FFF',
    borderRadius: 24,
  }
};
```

---

## 4. Typography

- **Headings:** `Varela Round` (Sans-serif, perfectly rounded terminals).
- **Body:** `Nunito Sans` (Clear, modern, friendly).
- **Scale:**
  - `H1`: 32px / 2rem (Bold)
  - `H2`: 24px / 1.5rem (SemiBold)
  - `Body`: 16px / 1rem (Regular)
  - `Caption`: 14px / 0.875rem (Medium)

---

## 5. Master Components Guide

### A. Buttons (The "Squishy" Button)
- **Shape:** Full rounded or 16px.
- **Hover/Active:** Scale down to `0.95` on press.
- **Shadow:** Deep shadow that becomes "pressed" (smaller) on active state.

### B. Cards (The "Container")
- **Padding:** Always `p-6` (24px).
- **Radius:** `rounded-3xl` (24px).
- **Style:** Pure white with soft outer shadow.

### C. Avatars
- **Style:** Rounded square (`rounded-2xl`) feels more "Clay" than a perfect circle.
- **Placeholder:** Use soft pastel gradients (e.g., Sky Blue to Indigo).

---

## 6. Anti-Patterns (❌ DO NOT USE)

- ❌ **Sharp Corners:** Avoid `rounded-none` or `rounded-sm`. Minimum is `rounded-lg`.
- ❌ **Pure Black:** Never use `#000000`. Use `#0F172A` (Navy) for dark mode.
- ❌ **Harsh Gradients:** Avoid high-contrast gradients. Use subtle HSL shifts.
- ❌ **Instant Hover:** All transitions must use `cubic-bezier(0.4, 0, 0.2, 1)` and last `200ms-300ms`.
- ❌ **Complex Icons:** Use `Lucide` or `Heroicons` with `stroke-width={1.5}` or `{2}`. No filled, complex icons.

---

## 7. Interaction Checklist

- [ ] Does it squish when I click it? (Scale 0.98)
- [ ] Is the shadow soft enough to look like paper/clay?
- [ ] Are the colors accessible (Contrast 4.5:1)?
- [ ] Does it look "cutie" but still professional?
- [ ] Responsive check: Mobile feels "chunky" and easy to tap.

---
*Last Updated: 2026-04-28 - Unified Web & Mobile Master*
