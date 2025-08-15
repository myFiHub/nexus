# Dialog Components

This directory contains reusable dialog components for the Nexus application.

## Transfer Balance Dialog

The `transferBalanceDialog` is an async dialog component that allows users to select an amount of MOVE tokens to transfer.

### Features

- **Balance Display**: Shows current MOVE balance from Redux store
- **Address Input**: Text input field for recipient Aptos address with validation
- **Amount Input**: Numeric input field for transfer amount
- **Percentage Slider**: Interactive slider to select percentage of total balance
- **Quick Percentage Buttons**: 25%, 50%, 75%, and 100% quick selection buttons
- **Real-time Validation**: Validates amount against available balance and address format
- **Rich Animations**: Smooth animations using Framer Motion
- **Async API**: Returns Promise with selected amount and address

### Usage

```typescript
import { transferBalanceDialog } from "app/components/Dialog";

const handleTransfer = async () => {
  try {
    const result = await transferBalanceDialog();
    
    if (result.amount > 0) {
      // User confirmed with amount and address
      console.log(`Transfer amount: ${result.amount} MOVE to ${result.address}`);
      // Proceed with transfer logic
      await performTransfer(result.amount, result.address);
    } else {
      // User cancelled or clicked outside
      console.log("Transfer cancelled");
    }
  } catch (error) {
    console.error("Error in transfer dialog:", error);
  }
};
```

### API

#### `transferBalanceDialog()`

Returns a Promise that resolves to:

- `{ amount: number > 0, address: string }`: The confirmed transfer amount in MOVE and recipient address
- `{ amount: 0, address: "" }`: If user cancelled or clicked outside the dialog

### Implementation Details

- **Redux Integration**: Reads balance from `AssetsSelectors.balance`
- **Validation**: Ensures amount is positive and doesn't exceed balance, validates Aptos address format
- **Bidirectional Sync**: Input and slider stay in sync
- **Address Validation**: Real-time validation of 64-character hex Aptos addresses
- **Responsive Design**: Works on mobile and desktop
- **Dark Mode Support**: Includes dark mode styling
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Styling

The dialog uses a blue-purple gradient theme with:

- Modern card design with rounded corners
- Smooth hover and focus states
- Consistent spacing and typography
- Dark mode support
- Responsive layout

### Dependencies

- `framer-motion` for animations
- `@radix-ui/react-dialog` for dialog functionality
- `@radix-ui/react-slider` for slider component
- Redux for state management
- Tailwind CSS for styling
