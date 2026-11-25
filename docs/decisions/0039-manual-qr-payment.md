# 0039 — Manual QR payment alongside COD and SSLCommerz

## Context

Juliet's Zeal takes payment three ways, each switched on independently so any
combination can show at checkout:

- cash on delivery;
- online payment through SSLCommerz (its hosted page offers bKash, Nagad,
  Rocket and cards);
- a manual QR transfer: the shopper scans the store's bKash/Nagad QR code,
  pays, and tells us which number paid and the transaction ID. Nothing calls
  back automatically, so a person has to check the transfer before the order
  goes ahead.

## Decision

- New `PaymentMethod.QR` (migration `20261125072540_add_qr_payment_method`).
  Storefront value `qr`, mapped in `paymentToDb`.
- The shopper's proof lives on the order's `Payment` row: `gatewayRef` is the
  transaction ID (upper-cased), `payload` is `{ payerNumber, transactionId }`.
  No new `Order` columns — `Payment` already models "a reference to check
  against an external ledger".
- QR settings sit with COD in Admin → Settings → Checkout (`qrEnabled`,
  `qrImage`, `qrAccount`, `qrNote`). QR can't be switched on without an
  uploaded image, and the storefront never offers QR without one.
  SSLCommerz keeps its on/off in Settings → Integrations, next to its keys.
- `placeOrder()` re-validates everything server-side and gates every method:
  COD only while on, QR only while on, and the gateway methods only while
  SSLCommerz is configured (previously accepted even with no gateway). A
  transaction ID already attached to a live QR payment (any status but
  FAILED/CANCELLED) is rejected with 409, so one transfer can't pay two
  orders.
- Verification reuses the existing admin payment panel: it now shows the
  submitted number and ID, and staff set the payment to Paid (which fires the
  server-side Purchase signal, as for any non-COD method) and confirm the
  order — or set it to Failed.
- The `cancel-unpaid-orders` cron skips QR orders: they are waiting on staff,
  not on the shopper.

## Consequences

- One migration to run on deploy (`prisma migrate deploy`); no new env vars
  or cron jobs.
- Staff must check QR orders by hand; until they do, the order stays PENDING
  with a PENDING payment.
- As with COD, the browser `purchase` event fires on the success page when a
  QR order is placed, before staff verify it; the server-side Purchase signal
  waits for Paid (see DATA_LAYER_ENABLE.md §১২).
- Transaction IDs are checked for reuse within this store only; we can't
  confirm with bKash/Nagad that the transfer happened — that's the staff
  check.
