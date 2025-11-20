<!-- 85d30051-e1ac-4658-ab85-32dbf751697e 5e66ad74-a26c-4c65-882f-0314195d092c -->
# Cashier Portal Redesign Implementation

## Overview

Transform CashierPortal.vue into a two-stage flow: a landing page with "Scan QR" button, followed by an employee details screen where cashiers can input transaction amounts with auto-calculated discounts.

## Implementation Steps

### 1. Add validate_qr_code API to transaction.ts

- Add new function `validateQRCode(qr_value: string)` that calls `employeediscount.api.transaction.validate_qr_code`
- Add response type for employee data (profile, balance, discount percentage, session expiry)
- Update `src/components/lib/types.ts` with new types

### 2. Create Landing Page Design

Implement first Figma screen (870-1247) in CashierPortal.vue:

- Background with rotated fashion image (from Figma)
- "Cashier Portal" heading with "Melissa - Grand Indonesia" subtitle
- Three action buttons (rotated 270deg to match design):
- "Scan QR" (functional)
- "Transaction History" (disabled for now)
- "Contact IT Support" (disabled for now)
- Match exact styling: white text, semi-transparent button backgrounds

### 3. Implement QR Scanner Flow

- Add QR scanner modal (reuse existing QRScannerFast component)
- On scan success, call `validateQRCode()` API
- Transition to employee details screen with fetched data

### 4. Create Employee Details Screen

Implement second Figma screen (881-413):

- **Left Panel**: Employee card display
- Profile photo (circular)
- Employee name (bold, large)
- Position/department
- "Joined since" date
- "Staff" badge (black background)
- Card type badges ("EMPLOYEE CARD", "40% DISCOUNT")
- Remaining balance with orange accent color
- Progress bar showing balance usage
- Note: "The balance resets on the 1st of every month"

- **Right Panel**: Transaction input
- Session countdown timer (top, shows minutes:seconds)
- Warning text about auto-cancellation
- "Input Total Transaction Amount" field (large display)
- "Calculated Discount" field (auto-calculated in orange)
- "Proceed" button (white text on transparent background)
- "Dismiss Payment Process" button (gray text)

### 5. Implement Real-time Discount Calculation

- Watch the amount input field
- Calculate discount using: `discount = amount * (discount_percentage / 100)`
- Update calculated discount display immediately
- Format both amounts as "IDR X.XXX.XXX"

### 6. Add Session Timer Countdown

- Get session duration from validate_qr_code API response
- Display countdown in MM:SS format
- Show warning when time is low
- Auto-dismiss/cancel transaction when timer reaches 0

### 7. Handle Transaction Completion

- "Proceed" button: Call existing `processTransaction()` with amount, employee QR, etc.
- Navigate to TransactionResult page on success
- "Dismiss" button: Return to landing page, clear state

## Key Files to Modify

- `src/components/pages/cashier/CashierPortal.vue` (main component)
- `src/components/lib/transaction.ts` (add validateQRCode API)
- `src/components/lib/types.ts` (add QRValidationResponse type)

## Design Notes

- Use rotated layout (270deg) to match tablet landscape orientation from Figma
- Maintain existing color scheme: black/gray for primary, orange (#cb8a2e) for accents
- Reuse existing UI components (Input, Modal, QRScannerFast)
- All text should match Figma exactly (fonts: Inter)

### To-dos

- [ ] Add QRValidationResponse type and validateQRCode function to lib
- [ ] Implement landing page with background image and action buttons
- [ ] Create employee card details display panel
- [ ] Build transaction amount input with real-time discount calc
- [ ] Implement countdown timer and auto-cancel logic
- [ ] Connect Proceed button to processTransaction API