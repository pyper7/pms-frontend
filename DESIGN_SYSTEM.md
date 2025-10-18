# Performance Management System - Design System

## 🎨 **Comprehensive Design System Documentation**

### **1. Typography System**

#### **Font Family**
- **Primary**: Inter (Google Fonts)
- **Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif

#### **Font Scale & Hierarchy**
```css
/* Headings */
h1: text-4xl font-bold tracking-tight    /* 36px - Page titles */
h2: text-3xl font-semibold tracking-tight /* 30px - Section titles */
h3: text-2xl font-semibold tracking-tight /* 24px - Card titles */
h4: text-xl font-semibold tracking-tight  /* 20px - Subsection titles */
h5: text-lg font-semibold tracking-tight  /* 18px - Component titles */
h6: text-base font-semibold tracking-tight /* 16px - Small titles */

/* Body Text */
body-large: text-lg font-normal leading-relaxed    /* 18px - Important content */
body: text-base font-normal leading-relaxed        /* 16px - Default content */
body-small: text-sm font-normal leading-relaxed    /* 14px - Secondary content */
caption: text-xs font-normal leading-relaxed       /* 12px - Captions, labels */

/* Special Text */
display: text-5xl font-bold tracking-tight         /* 48px - Hero text */
lead: text-xl font-normal leading-relaxed          /* 20px - Lead paragraphs */
```

#### **Font Weights**
- **Thin**: 100
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700
- **Extrabold**: 800
- **Black**: 900

### **2. Color System**

#### **Primary Colors**
```css
/* Light Mode */
--primary: 120 100% 20%        /* Deep Green */
--primary-foreground: 0 0% 100% /* White */

/* Dark Mode */
--primary: 142 76% 36%         /* Emerald Green */
--primary-foreground: 355 7% 97% /* Off White */
```

#### **Semantic Colors**
```css
/* Success */
--success: 120 100% 20%        /* Green */
--success-foreground: 0 0% 100%

/* Warning */
--warning: 43 96% 56%          /* Amber */
--warning-foreground: 0 0% 100%

/* Error/Destructive */
--destructive: 0 84% 60%       /* Red */
--destructive-foreground: 0 0% 100%

/* Info */
--info: 217 91% 60%            /* Blue */
--info-foreground: 0 0% 100%
```

#### **Neutral Colors**
```css
/* Light Mode */
--background: 0 0% 98%         /* Off White */
--foreground: 220 13% 18%      /* Dark Gray */
--muted: 220 13% 95%           /* Light Gray */
--muted-foreground: 220 13% 46% /* Medium Gray */
--border: 220 13% 91%          /* Border Gray */

/* Dark Mode */
--background: 240 10% 3.9%     /* Dark Background */
--foreground: 0 0% 98%         /* Light Text */
--muted: 240 3.7% 15.9%        /* Dark Muted */
--muted-foreground: 240 5% 64.9% /* Medium Light */
--border: 240 3.7% 15.9%       /* Dark Border */
```

### **3. Spacing System**

#### **Base Spacing Scale**
```css
/* Tailwind Spacing Scale */
0: 0px
1: 4px
2: 8px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
20: 80px
24: 96px
32: 128px
40: 160px
48: 192px
56: 224px
64: 256px
```

#### **Component Spacing**
```css
/* Card Padding */
card-padding: p-6              /* 24px */
card-padding-small: p-4        /* 16px */
card-padding-large: p-8        /* 32px */

/* Section Spacing */
section-gap: space-y-8         /* 32px between sections */
section-gap-small: space-y-6   /* 24px between sections */
section-gap-large: space-y-12  /* 48px between sections */

/* Grid Gaps */
grid-gap: gap-6                /* 24px */
grid-gap-small: gap-4          /* 16px */
grid-gap-large: gap-8          /* 32px */
```

### **4. Border Radius System**

```css
/* Border Radius Scale */
--radius: 0.5rem              /* 8px - Default */
radius-sm: 0.25rem            /* 4px - Small elements */
radius: 0.5rem                /* 8px - Default */
radius-md: 0.75rem            /* 12px - Medium elements */
radius-lg: 1rem               /* 16px - Large elements */
radius-xl: 1.5rem             /* 24px - Extra large */
radius-full: 9999px           /* Fully rounded */
```

### **5. Shadow System**

```css
/* Shadow Scale */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)

/* Custom Shadows */
shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
shadow-card-hover: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
```

### **6. Component Design Patterns**

#### **Card Components**
```css
.card-base {
  @apply bg-white dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm;
}

.card-hover {
  @apply hover:shadow-lg transition-all duration-300;
}

.card-interactive {
  @apply hover:scale-105 cursor-pointer;
}
```

#### **Button Variants**
```css
.btn-primary {
  @apply bg-primary text-primary-foreground hover:bg-primary/90 font-medium;
}

.btn-secondary {
  @apply bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium;
}

.btn-outline {
  @apply border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium;
}

.btn-ghost {
  @apply hover:bg-accent hover:text-accent-foreground font-medium;
}
```

#### **Badge Variants**
```css
.badge-success {
  @apply bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400;
}

.badge-error {
  @apply bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400;
}

.badge-info {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400;
}
```

### **7. Layout Patterns**

#### **Page Layout**
```css
.page-container {
  @apply p-6 space-y-8;
}

.page-header {
  @apply bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm;
}

.section-container {
  @apply space-y-6;
}
```

#### **Grid Systems**
```css
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6;
}

.grid-cards {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.grid-stats {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}
```

### **8. Animation System**

#### **Transitions**
```css
.transition-base {
  @apply transition-all duration-300 ease-in-out;
}

.transition-fast {
  @apply transition-all duration-200 ease-in-out;
}

.transition-slow {
  @apply transition-all duration-500 ease-in-out;
}
```

#### **Hover Effects**
```css
.hover-scale {
  @apply hover:scale-105 transition-transform duration-300;
}

.hover-lift {
  @apply hover:-translate-y-1 transition-transform duration-300;
}

.hover-glow {
  @apply hover:shadow-lg hover:shadow-primary/25 transition-shadow duration-300;
}
```

### **9. Dark Mode Enhancements**

#### **Opacity Tokens**
```css
--white-5: 255 255 255 / 0.05;
--white-10: 255 255 255 / 0.1;
--white-15: 255 255 255 / 0.15;
--white-20: 255 255 255 / 0.2;
--white-25: 255 255 255 / 0.25;
--white-30: 255 255 255 / 0.3;
--white-40: 255 255 255 / 0.4;
--white-50: 255 255 255 / 0.5;
--white-60: 255 255 255 / 0.6;
--white-70: 255 255 255 / 0.7;
--white-80: 255 255 255 / 0.8;
--white-90: 255 255 255 / 0.9;
--white-95: 255 255 255 / 0.95;
```

#### **Gradients**
```css
.gradient-primary {
  background: linear-gradient(135deg, hsl(142 76% 36%), hsl(142 76% 30%));
}

.gradient-secondary {
  background: linear-gradient(135deg, hsl(240 3.7% 15.9%), hsl(240 3.7% 12%));
}

.gradient-card {
  background: linear-gradient(135deg, hsl(240 10% 3.9%), hsl(240 5.9% 10%));
}
```

### **10. Accessibility Standards**

#### **Color Contrast**
- **AA Standard**: 4.5:1 for normal text
- **AAA Standard**: 7:1 for normal text
- **Large Text**: 3:1 for 18px+ or 14px+ bold

#### **Focus States**
```css
.focus-visible {
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
}
```

#### **Screen Reader Support**
- All interactive elements have proper ARIA labels
- Form inputs have associated labels
- Status changes are announced to screen readers

### **11. Responsive Breakpoints**

```css
/* Mobile First Approach */
sm: 640px    /* Small devices */
md: 768px    /* Medium devices */
lg: 1024px   /* Large devices */
xl: 1280px   /* Extra large devices */
2xl: 1536px  /* 2X large devices */
```

### **12. Performance Considerations**

#### **CSS Optimization**
- Use CSS custom properties for theming
- Minimize CSS bundle size
- Use efficient selectors
- Leverage CSS Grid and Flexbox

#### **Animation Performance**
- Use transform and opacity for animations
- Avoid animating layout properties
- Use will-change sparingly
- Prefer CSS animations over JavaScript

---

## 🚀 **Implementation Priority**

### **Phase 1: Core Typography & Colors**
1. Standardize all heading sizes
2. Implement consistent color usage
3. Update font weights across components

### **Phase 2: Component Consistency**
1. Standardize card designs
2. Update button variants
3. Implement consistent spacing

### **Phase 3: Layout & Animation**
1. Apply consistent layout patterns
2. Implement animation system
3. Enhance dark mode

### **Phase 4: Polish & Optimization**
1. Accessibility improvements
2. Performance optimization
3. Final consistency checks
