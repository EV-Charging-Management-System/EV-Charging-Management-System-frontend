# 🔄 Payment Flow Diagram

## Luồng Thanh Toán Invoice với VNPay

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PAYMENT PAGE                                 │
│                     /payment (Payment.tsx)                          │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Mount → fetchInvoices()
                              ↓
                    ┌──────────────────────┐
                    │   GET /api/payment   │
                    │      /invoices       │
                    └──────────────────────┘
                              │
                              │ 2. Display invoices
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│  Invoice Cards:                                                     │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Invoice #33          [PENDING ⏰]            │                  │
│  │ Mã phiên: #42                                │                  │
│  │ Tổng tiền: 192,000đ                          │                  │
│  │                                               │                  │
│  │ [  💳 Thanh toán ngay (VNPay)  ]            │                  │
│  └──────────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 3. User clicks "Thanh toán ngay"
                              ↓
                  ┌─────────────────────────┐
                  │ handlePayInvoice(33)    │
                  │                         │
                  │ POST /api/vnpay/        │
                  │   create-invoice        │
                  │                         │
                  │ Body: {                 │
                  │   invoiceId: 33,        │
                  │   orderInfo: "..."      │
                  │ }                       │
                  └─────────────────────────┘
                              │
                              │ 4. Receive VNPay URL
                              ↓
              ┌──────────────────────────────────┐
              │ localStorage.setItem():          │
              │  - payingInvoiceId: "33"        │
              │  - invoicePaymentMethod: "VNPAY"│
              └──────────────────────────────────┘
                              │
                              │ 5. Redirect to VNPay
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         VNPAY GATEWAY                               │
│                  https://sandbox.vnpayment.vn                       │
│                                                                     │
│  ┌────────────────────────────────────────────────┐                │
│  │  Thanh toán hóa đơn #33                        │                │
│  │  Số tiền: 192,000 VNĐ                          │                │
│  │                                                 │                │
│  │  [Thẻ ATM] [Thẻ quốc tế] [QR Code]            │                │
│  └────────────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 6. User completes payment
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│              VNPay redirects back to frontend                       │
│  /payment-success?code=00&txnRef=INV_33_28_xxx&vnp_Amount=19200000│
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 7. PaymentSuccess.tsx mount
                              ↓
                  ┌─────────────────────────┐
                  │ useEffect() detects:    │
                  │  - code=00 (success)    │
                  │  - payingInvoiceId: 33  │
                  │                         │
                  │ → Xác định: INVOICE     │
                  │    payment type         │
                  └─────────────────────────┘
                              │
                              │ 8. Call API to complete payment
                              ↓
                    ┌──────────────────────┐
                    │ PATCH /api/payment/  │
                    │       33/pay         │
                    │                      │
                    │ Body: {              │
                    │   paymentMethod:     │
                    │     "VNPAY"          │
                    │ }                    │
                    └──────────────────────┘
                              │
                              │ 9. Backend updates invoice
                              │    PaidStatus: "PAID"
                              ↓
              ┌──────────────────────────────────┐
              │ localStorage.removeItem():       │
              │  - payingInvoiceId              │
              │  - invoicePaymentMethod         │
              └──────────────────────────────────┘
                              │
                              │ 10. Show success message
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    PAYMENT SUCCESS PAGE                             │
│                                                                     │
│     ✅ Thanh Toán Thành Công!                                       │
│                                                                     │
│     🎉 Hóa đơn của bạn đã được thanh toán thành công!              │
│     Bạn sẽ được chuyển về trang quản lý hóa đơn sau 3 giây...     │
│                                                                     │
│     Mã giao dịch: INV_33_28_xxx                                    │
│     Số tiền: 192,000đ                                               │
│                                                                     │
│     [ Quay về trang hóa đơn ]                                       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ 11. After 3s: navigate("/payment")
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BACK TO PAYMENT PAGE                             │
│                                                                     │
│  ┌──────────────────────────────────────────────┐                  │
│  │ Invoice #33          [PAID ✅]               │ ← Status updated │
│  │ Mã phiên: #42                                │                  │
│  │ Tổng tiền: 192,000đ                          │                  │
│  │                                               │                  │
│  │ [  ✅ Đã thanh toán  ]                       │                  │
│  └──────────────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

## So Sánh 3 Luồng Thanh Toán

### 1️⃣ Invoice Payment (Mới)
```
Payment Page → Select Invoice → VNPay → Callback 
→ payInvoice() → Update status → Back to Payment
```

### 2️⃣ Booking Payment (Đã có)
```
Booking Page → Enter details → VNPay → Callback 
→ createBooking() → Create booking → Show schedule
```

### 3️⃣ Premium Payment (Đã có)
```
Premium Page → Select package → VNPay → Callback 
→ No additional API → Show membership
```

## Key Differences

| Aspect | Invoice | Booking | Premium |
|--------|---------|---------|---------|
| **Before VNPay** | Store `payingInvoiceId` | Store `bookingPayload` | Nothing |
| **Create API** | `/vnpay/create-invoice` | `/vnpay/create` | `/vnpay/create-premium` |
| **After Callback** | Call `payInvoice()` | Call `createBooking()` | Nothing |
| **LocalStorage Key** | `payingInvoiceId` | `bookingPayload` | None |
| **Redirect After** | `/payment` | `/charging-schedule` | `/premium` |

## State Management in Payment.tsx

```typescript
// States
const [invoices, setInvoices] = useState<Invoice[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [payingInvoiceId, setPayingInvoiceId] = useState<number | null>(null);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"CASH" | "VNPAY" | "WALLET">("VNPAY");

// Flow
useEffect(() => fetchInvoices() ) // On mount
  ↓
Display invoices with status badges
  ↓
User selects payment method (VNPay/Cash/Wallet)
  ↓
User clicks "Thanh toán ngay"
  ↓
IF VNPay:
  createVnpayInvoice() → Save to localStorage → Redirect
ELSE:
  payInvoice() directly → Alert → Reload invoices
```

## PaymentSuccess Detection Logic

```typescript
const savedInvoiceId = localStorage.getItem("payingInvoiceId");
const savedBookingPayload = localStorage.getItem("bookingPayload");

if (savedInvoiceId) {
  // 📄 INVOICE PAYMENT
  setPaymentType("invoice");
  await payInvoice(invoiceId, { paymentMethod: "VNPAY" });
  setTimeout(() => navigate("/payment"), 3000);
  
} else if (savedBookingPayload) {
  // 🚗 BOOKING PAYMENT
  setPaymentType("booking");
  await createBooking(payload);
  // Stay on success page
  
} else {
  // 💎 PREMIUM PAYMENT
  setPaymentType("premium");
  // Just show success message
}
```

---

**Lưu ý quan trọng:**
- Luồng Invoice payment hoàn toàn tương đồng với Booking
- Chỉ khác ở API endpoint và localStorage key
- PaymentSuccess.tsx handle cả 3 loại thanh toán
- Sử dụng `useRef` để prevent double execution
