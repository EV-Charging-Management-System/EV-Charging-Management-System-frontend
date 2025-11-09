# 💳 Payment Feature - Quick Start

## 🎯 Tổng Quan
Tính năng quản lý và thanh toán hóa đơn (invoices) cho hệ thống EV Charging Management.

## 📦 Files Created/Modified

```
src/
├── services/
│   └── paymentService.ts          ← MỚI: API service cho payment
├── pages/
│   └── EV-Driver/
│       ├── Payment.tsx            ← CẬP NHẬT: Hiển thị invoice list
│       └── PaymentSuccess.tsx     ← CẬP NHẬT: Xử lý callback
└── css/
    └── Payment.css                ← CẬP NHẬT: Styles mới
```

## 🚀 APIs Được Tích Hợp

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/payment/invoices` | Lấy danh sách hóa đơn |
| PATCH | `/api/payment/:id/pay` | Thanh toán hóa đơn |
| POST | `/api/vnpay/create-invoice` | Tạo URL VNPay |

## 💡 Features

✅ **Hiển thị danh sách hóa đơn**
- Grid layout responsive
- Status badges (PENDING/PAID/FAILED)
- Thông tin chi tiết: ID, session, amount, date

✅ **Chọn phương thức thanh toán**
- VNPay (mặc định)
- Ví EV Wallet
- Tiền mặt (Cash)

✅ **Thanh toán VNPay**
- Redirect đến VNPay gateway
- Xử lý callback tự động
- Cập nhật trạng thái hóa đơn

✅ **Loading & Error States**
- Spinner khi loading
- Error message với retry button
- Empty state

## 🔄 Luồng Hoạt Động

### VNPay Payment Flow
```
Payment Page 
  → Click "Thanh toán" 
  → Redirect VNPay 
  → Complete payment 
  → Callback PaymentSuccess 
  → Update invoice status 
  → Return to Payment Page
```

### Direct Payment (Cash/Wallet)
```
Payment Page 
  → Select method 
  → Click "Thanh toán" 
  → Call API directly 
  → Update invoice immediately
```

## 📱 UI/UX

### Payment Method Selector
```tsx
[ VNPay ]  [ Ví EV ]  [ Tiền mặt ]
   ↑ active    
```

### Invoice Card
```
┌────────────────────────────────┐
│ Invoice #33         [PENDING ⏰]│
│                                 │
│ Mã phiên: #42                  │
│ Tổng tiền: 192,000đ            │
│                                 │
│ [  💳 Thanh toán ngay  ]       │
└────────────────────────────────┘
```

## 🧪 Testing

### Quick Test
1. Login as customer
2. Navigate to `/payment`
3. See invoices list
4. Click "Thanh toán ngay"
5. Complete VNPay payment
6. Verify status updated

### VNPay Test Card
```
Card: 9704198526191432198
Name: NGUYEN VAN A
Date: 07/15
OTP: 123456
```

## 📚 Documentation

- `PAYMENT_FEATURE_SUMMARY.md` - Chi tiết đầy đủ
- `PAYMENT_FLOW_DIAGRAM.md` - Sơ đồ luồng
- `TESTING_GUIDE_PAYMENT.md` - Hướng dẫn test

## 🔧 Implementation Details

### paymentService.ts
```typescript
// Get invoices
await paymentService.getInvoices();

// Create VNPay URL
await paymentService.createVnpayInvoice({
  invoiceId: 33,
  orderInfo: "Thanh toán hóa đơn #33"
});

// Pay invoice
await paymentService.payInvoice(33, {
  paymentMethod: "VNPAY"
});
```

### Payment.tsx
```tsx
// State management
const [invoices, setInvoices] = useState<Invoice[]>([]);
const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("VNPAY");
const [payingInvoiceId, setPayingInvoiceId] = useState<number | null>(null);

// Fetch on mount
useEffect(() => { fetchInvoices(); }, []);

// Handle payment
const handlePayInvoice = async (invoice) => {
  if (selectedPaymentMethod === "VNPAY") {
    // Redirect to VNPay
  } else {
    // Pay directly
  }
};
```

### PaymentSuccess.tsx
```tsx
// Detect payment type
const savedInvoiceId = localStorage.getItem("payingInvoiceId");

if (savedInvoiceId) {
  // Process invoice payment
  await payInvoice(invoiceId, { paymentMethod: "VNPAY" });
  // Clean up & redirect
}
```

## ⚠️ Important Notes

1. **LocalStorage Keys:**
   - `payingInvoiceId` - Invoice being paid
   - `invoicePaymentMethod` - Selected payment method

2. **Payment Type Detection:**
   - Invoice: Check `payingInvoiceId`
   - Booking: Check `bookingPayload`
   - Premium: None above

3. **Prevent Double Execution:**
   ```tsx
   const hasRun = useRef(false);
   if (hasRun.current) return;
   hasRun.current = true;
   ```

## 🎨 Styling

### Colors
- Primary: `#00ffcc` (cyan)
- Success: `#00ff88` (green)
- Warning: `#ffaa00` (yellow)
- Error: `#ff6b6b` (red)

### Status Badges
- PAID: Green with ✅
- PENDING: Yellow with ⏰
- FAILED: Red with ❌

## 🚨 Troubleshooting

**Invoices not loading?**
- Check backend running
- Verify user logged in
- Check API endpoint

**VNPay redirect fails?**
- Check URL received
- Verify localStorage saved
- Check browser console

**Status not updating?**
- Check API response
- Verify fetchInvoices() called
- Check backend database

## 📞 Support

For issues or questions:
1. Check console logs
2. Review network requests
3. Verify API responses
4. Check documentation

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-09  
**Status:** ✅ Production Ready
