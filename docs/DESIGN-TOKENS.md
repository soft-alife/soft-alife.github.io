# SAL Lab — 디자인 토큰

pencil 시안 기반 shadcn/ui 스타일 디자인 토큰 정리.

## Colors

```css
:root {
  /* shadcn neutral scale */
  --background: #FFFFFF;
  --foreground: #0A0A0A;
  --muted: #71717A;
  --muted-foreground: #A1A1AA;
  --border: #E4E4E7;
  --input: #E4E4E7;
  --ring: #D4735E;
  --secondary: #F4F4F5;
  --secondary-foreground: #52525B;
  --accent: #F4F4F5;
  --accent-foreground: #18181B;
  --card: #FFFFFF;
  --card-foreground: #0A0A0A;
  --popover: #FFFFFF;
  --popover-foreground: #0A0A0A;
  --primary: #18181B;
  --primary-foreground: #FFFFFF;
  --destructive: #EF4444;
  --destructive-foreground: #FFFFFF;

  /* SAL brand */
  --sal-terracotta: #D4735E;
  --sal-navy: #1E3A5F;
  --sal-navy-border: #1E293B;

  /* page backgrounds */
  --page-bg: #FFFFFF;
  --page-header-bg: #FAFAFA;
  --footer-bg: #F4F4F5;
  --topbar-bg: #1E3A5F;
}
```

## Typography

```css
:root {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  /* sizes */
  --text-xs: 11px;
  --text-sm: 12px;
  --text-base: 13px;
  --text-md: 14px;
  --text-lg: 15px;
  --text-xl: 16px;
  --text-2xl: 18px;
  --text-3xl: 20px;
  --text-4xl: 42px;   /* hero title */

  /* weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;

  /* line heights */
  --leading-tight: 1.15;
  --leading-normal: 1.5;
  --leading-relaxed: 1.7;
}
```

## Spacing

```css
:root {
  --radius-sm: 4px;
  --radius: 8px;
  --radius-pill: 9999px;

  --spacing-page-x: 60px;
  --spacing-page-y: 40px;
  --spacing-section: 48px;
  --spacing-card: 20px 24px;

  --gap-sm: 8px;
  --gap-md: 16px;
  --gap-lg: 28px;   /* nav links gap */
}
```

## Components

### Nav
- Height: 60px
- Padding: 0 60px
- Border bottom: 1px #E4E4E7
- Logo: 32x32
- "SAL" text: 16px, 700, #0A0A0A, letter-spacing: 1px
- Link: 13px, 400, #71717A
- Active link: 13px, 600, #D4735E + bottom 2px border

### TopBar
- Height: 28px
- Background: #1E3A5F
- Text: 11px, #CBD5E1
- Border bottom: 1px #1E293B

### Card
- Border: 1px #E4E4E7
- Radius: 8px
- Background: #FFFFFF
- Padding: 20px 24px

### Badge (Pill)
- Background: #F4F4F5
- Text: 10-12px, #52525B
- Radius: 9999px
- Padding: 3px 8px

### Button (Primary)
- Background: #18181B
- Text: #FFFFFF
- Radius: 8px
- Padding: 8px 16px

### Accordion Item
- Border bottom: 1px #E4E4E7
- Padding: 16px 0
- Title: 15px, 600, #0A0A0A
- Description: 13px, 400, #71717A
- Icon: chevron-down, 16px, #A1A1AA

### Filter Tab
- Inactive: 1px #E4E4E7 border, 8px radius
- Active: #18181B fill, white text, 8px radius
- Text: 12-13px

### Search Box
- Border: 1px #E4E4E7
- Radius: 8px
- Padding: 8px 12px
- Placeholder: #A1A1AA
- Icon: search, 14px, #A1A1AA

### Footer
- Background: #F4F4F5
- Padding: 40px 48px
- Text: 12px, #71717A

### Page Header
- Background: #FAFAFA
- Padding: 28px 60px 20px 60px
- Border bottom: 1px #E4E4E7
- Title: 24px+, 700, #0A0A0A
- Breadcrumb: 12px, #A1A1AA
