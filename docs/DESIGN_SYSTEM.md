# Podium Design System

## Brand Identity

### Colors
```css
/* Primary Colors */
--primary-100: #E6F7FF;
--primary-500: #1890FF;
--primary-900: #003A8C;

/* Secondary Colors */
--secondary-100: #F6FFED;
--secondary-500: #52C41A;
--secondary-900: #135200;

/* Neutral Colors */
--neutral-50: #FAFAFA;
--neutral-100: #F5F5F5;
--neutral-200: #EEEEEE;
--neutral-300: #E0E0E0;
--neutral-400: #BDBDBD;
--neutral-500: #9E9E9E;
--neutral-600: #757575;
--neutral-700: #616161;
--neutral-800: #424242;
--neutral-900: #212121;

/* Semantic Colors */
--success: #52C41A;
--warning: #FAAD14;
--error: #FF4D4F;
--info: #1890FF;
```

### Typography
```css
/* Font Families */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.125rem;  /* 18px */
--text-xl: 1.25rem;   /* 20px */
--text-2xl: 1.5rem;   /* 24px */
--text-3xl: 1.875rem; /* 30px */
--text-4xl: 2.25rem;  /* 36px */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

## Component Library

### Buttons
```css
/* Primary Button */
.btn-primary {
  background: var(--primary-500);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

/* Secondary Button */
.btn-secondary {
  background: white;
  color: var(--primary-500);
  border: 1px solid var(--primary-500);
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
  font-weight: 500;
}

/* Ghost Button */
.btn-ghost {
  background: transparent;
  color: var(--neutral-700);
  padding: var(--space-2) var(--space-4);
  border-radius: 6px;
}
```

### Cards
```css
/* Base Card */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: var(--space-4);
}

/* Hover Card */
.card-hover {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
```

### Forms
```css
/* Input Field */
.input {
  border: 1px solid var(--neutral-300);
  border-radius: 6px;
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-base);
  transition: border-color 0.2s;
}

.input:focus {
  border-color: var(--primary-500);
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* Select */
.select {
  border: 1px solid var(--neutral-300);
  border-radius: 6px;
  padding: var(--space-2) var(--space-3);
  background: white;
  cursor: pointer;
}
```

## Layout Guidelines

### Grid System
```css
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
}
```

### Breakpoints
```css
/* Mobile First */
@media (min-width: 640px) {
  /* Small devices */
}

@media (min-width: 768px) {
  /* Medium devices */
}

@media (min-width: 1024px) {
  /* Large devices */
}

@media (min-width: 1280px) {
  /* Extra large devices */
}
```

## Component Patterns

### Navigation
```typescript
interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href: string;
  badge?: number;
}

const Navigation: React.FC<{items: NavItem[]}> = ({items}) => {
  // Implementation
};
```

### Wallet Connection
```typescript
interface WalletProps {
  address?: string;
  balance?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletConnect: React.FC<WalletProps> = (props) => {
  // Implementation
};
```

### Notifications
```typescript
interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  duration?: number;
}

const showNotification = (props: NotificationProps) => {
  // Implementation
};
```

## Animation Guidelines

### Transitions
```css
/* Default Transition */
.transition-default {
  transition: all 0.2s ease-in-out;
}

/* Smooth Transition */
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Spring Transition */
.transition-spring {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Loading States
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-100) 25%,
    var(--neutral-200) 37%,
    var(--neutral-100) 63%
  );
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
```

## Accessibility Guidelines

### Focus States
```css
/* Focus Outline */
:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--primary-100), 0 0 0 4px var(--primary-500);
}

/* Focus Within */
.focus-within:focus-within {
  border-color: var(--primary-500);
}
```

### Screen Reader
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Responsive Design

### Container Widths
```css
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: var(--space-4);
  padding-left: var(--space-4);
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

### Responsive Typography
```css
/* Base Font Size */
html {
  font-size: 16px;
}

@media (min-width: 768px) {
  html {
    font-size: 18px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 20px;
  }
}
```

## Dark Mode

### Color Variables
```css
:root {
  /* Light Mode */
  --bg-primary: white;
  --text-primary: var(--neutral-900);
  --border-color: var(--neutral-200);
}

[data-theme="dark"] {
  --bg-primary: var(--neutral-900);
  --text-primary: white;
  --border-color: var(--neutral-800);
}
```

### Component Adaptation
```css
.card {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.input {
  background: var(--bg-primary);
  color: var(--text-primary);
  border-color: var(--border-color);
}
``` 