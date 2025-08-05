# Dialog Components

This directory contains reusable dialog components for the Nexus application.

## Login Selection Dialog

The `loginSelectionDialog` is an async dialog that allows users to choose between social login and Nightly wallet authentication.

### Features

- **Simple Interaction**: Click directly on an option to select it
- **Beautiful UI**: Modern design with smooth animations using Framer Motion
- **Theme Support**: Compatible with both light and dark themes
- **Responsive**: Works well on all screen sizes
- **Accessible**: Follows accessibility best practices
- **Type Safe**: Full TypeScript support with proper type definitions

### Usage

```typescript
import { loginSelectionDialog, LoginMethod } from "app/components/Dialog";

const handleLoginSelection = async () => {
  const result = await loginSelectionDialog();

  if (result.confirmed && result.loginMethod) {
    switch (result.loginMethod) {
      case LoginMethod.SOCIAL:
        // Handle social login
        console.log("User chose social login");
        break;
      case LoginMethod.NIGHTLY:
        // Handle Nightly wallet connection
        console.log("User chose Nightly wallet");
        break;
    }
  } else {
    console.log("User cancelled or clicked outside");
  }
};
```

### API

#### `loginSelectionDialog(): Promise<LoginSelectionDialogResult>`

**Returns:**

- `confirmed: boolean` - Whether the user confirmed their selection
- `loginMethod?: LoginMethod` - The selected login method (if confirmed)

**Behavior:**

- Clicking on an option immediately selects it and closes the dialog
- Clicking outside the dialog or pressing Escape returns `{ confirmed: false }`

#### `LoginMethod` Enum

```typescript
enum LoginMethod {
  SOCIAL = "social",
  NIGHTLY = "nightly",
}
```

### Styling

The dialog uses Tailwind CSS classes and is designed to work with the existing design system:

- **Social Login**: Blue to purple gradient theme
- **Nightly Wallet**: Orange to red gradient theme with the Nightly logo
- **Animations**: Smooth hover effects, selection animations, and entrance/exit transitions
- **Dark Mode**: Automatic theme adaptation with appropriate color schemes

### Integration

The dialog is automatically registered in the global container and can be used anywhere in the application. No additional setup is required.

### Example

See `loginSelectionDialog.example.tsx` for a complete usage example.
