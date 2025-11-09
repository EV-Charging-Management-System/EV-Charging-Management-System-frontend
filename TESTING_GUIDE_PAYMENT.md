# 🧪 Testing Guide - Payment Feature

## ✅ Checklist Test Scenarios

### 1. **Display Invoice List**

#### Test Case 1.1: Load invoices successfully
- [ ] Navigate to `/payment`
- [ ] Should show loading spinner
- [ ] Should fetch invoices from API
- [ ] Should display invoice cards
- [ ] Each card shows: ID, date, session, amount, status

#### Test Case 1.2: Empty state
- [ ] When user has no invoices
- [ ] Should show "Bạn chưa có hóa đơn nào"
- [ ] Should show empty icon

#### Test Case 1.3: Error state
- [ ] When API fails (disconnect backend)
- [ ] Should show error message
- [ ] Should show "Thử lại" button
- [ ] Click "Thử lại" should refetch

---

### 2. **Payment Method Selection**

#### Test Case 2.1: Default selection
- [ ] VNPay should be selected by default
- [ ] VNPay button has active class (green gradient)

#### Test Case 2.2: Switch methods
- [ ] Click "Ví EV" → should become active
- [ ] Click "Tiền mặt" → should become active
- [ ] Previous selection should deactivate
- [ ] Only one method active at a time

---

### 3. **Invoice Status Display**

#### Test Case 3.1: PENDING status
- [ ] Badge should be yellow (⏰)
- [ ] Should show "Thanh toán ngay" button
- [ ] Button should be enabled

#### Test Case 3.2: PAID status
- [ ] Badge should be green (✅)
- [ ] Should show "Đã thanh toán" badge
- [ ] No payment button

#### Test Case 3.3: FAILED status
- [ ] Badge should be red (❌)
- [ ] Should indicate failed status

---

### 4. **VNPay Payment Flow**

#### Test Case 4.1: Start payment
- [ ] Select VNPay method
- [ ] Click "Thanh toán ngay" on PENDING invoice
- [ ] Button should show loading spinner
- [ ] Button should be disabled
- [ ] Should call `POST /api/vnpay/create-invoice`

#### Test Case 4.2: Redirect to VNPay
- [ ] Should save to localStorage:
  - `payingInvoiceId`
  - `invoicePaymentMethod`
- [ ] Should redirect to VNPay sandbox URL
- [ ] URL should contain invoice amount

#### Test Case 4.3: Complete payment on VNPay
**Using VNPay Sandbox Test Cards:**
```
Card Number: 9704198526191432198
Name: NGUYEN VAN A
Issue Date: 07/15
OTP: 123456
```
- [ ] Enter test card info
- [ ] Complete OTP verification
- [ ] Should redirect to `/payment-success`

#### Test Case 4.4: Payment success callback
- [ ] URL should have `code=00`
- [ ] Should detect `payingInvoiceId` in localStorage
- [ ] Should call `PATCH /api/payment/:id/pay`
- [ ] Should show success message
- [ ] Should show transaction info
- [ ] After 3s: redirect to `/payment`

#### Test Case 4.5: Verify invoice updated
- [ ] Back on `/payment`
- [ ] Invoice status changed to "PAID"
- [ ] Button changed to "Đã thanh toán"
- [ ] LocalStorage cleaned up

---

### 5. **Direct Payment (Cash/Wallet)**

#### Test Case 5.1: Pay with Cash
- [ ] Select "Tiền mặt" method
- [ ] Click "Thanh toán ngay"
- [ ] Should show loading
- [ ] Should call `PATCH /api/payment/:id/pay` directly
- [ ] Should show alert "✅ Thanh toán thành công!"
- [ ] Should reload invoice list
- [ ] Invoice should change to PAID

#### Test Case 5.2: Pay with Wallet
- [ ] Same as 5.1 but with "Ví EV" method
- [ ] Should send `paymentMethod: "WALLET"`

---

### 6. **Multiple Invoices**

#### Test Case 6.1: Multiple pending invoices
- [ ] Create 3+ pending invoices
- [ ] All should show "Thanh toán ngay"
- [ ] Can only pay one at a time
- [ ] Other buttons disabled during payment

#### Test Case 6.2: Mixed statuses
- [ ] Show invoices with PENDING and PAID
- [ ] PENDING shows pay button
- [ ] PAID shows paid badge

---

### 7. **Error Handling**

#### Test Case 7.1: API error on payment
- [ ] Disconnect backend
- [ ] Try to pay invoice
- [ ] Should show error alert
- [ ] Should re-enable button
- [ ] Should not redirect

#### Test Case 7.2: VNPay error
- [ ] Mock VNPay error response
- [ ] Should show error message
- [ ] Should stay on payment page

#### Test Case 7.3: Cancel on VNPay
- [ ] Start payment → go to VNPay
- [ ] Click "Hủy giao dịch"
- [ ] Should redirect to `/payment-fail`

---

### 8. **Responsive Design**

#### Test Case 8.1: Mobile (< 768px)
- [ ] Invoice grid: 1 column
- [ ] Payment methods: vertical stack
- [ ] Cards: full width
- [ ] All buttons readable

#### Test Case 8.2: Tablet (768px - 1024px)
- [ ] Invoice grid: 2 columns
- [ ] Proper spacing

#### Test Case 8.3: Desktop (> 1024px)
- [ ] Invoice grid: 3+ columns
- [ ] Max width container

---

## 🛠️ Manual Testing Steps

### Setup
```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend
cd frontend
npm run dev

# 3. Login as customer
# Navigate to /payment
```

### Test Flow 1: VNPay Payment
```
1. Open /payment
2. Verify invoices load
3. Click payment method: VNPay
4. Click "Thanh toán ngay" on invoice #33
5. Should redirect to VNPay sandbox
6. Use test card:
   - Card: 9704198526191432198
   - Name: NGUYEN VAN A
   - Date: 07/15
   - OTP: 123456
7. Complete payment
8. Verify redirect to /payment-success
9. Verify success message
10. Wait 3 seconds
11. Verify redirect to /payment
12. Verify invoice #33 now PAID
```

### Test Flow 2: Cash Payment
```
1. Open /payment
2. Select "Tiền mặt"
3. Click "Thanh toán ngay"
4. Verify alert shows
5. Verify invoice updates immediately
```

---

## 🔍 Debug Checklist

### Browser Console
- [ ] No JavaScript errors
- [ ] API calls succeed (200 status)
- [ ] Response data structure correct

### Network Tab
- [ ] `GET /api/payment/invoices` → 200
- [ ] `POST /api/vnpay/create-invoice` → 200
- [ ] `PATCH /api/payment/:id/pay` → 200

### LocalStorage
- [ ] Before VNPay: has `payingInvoiceId`
- [ ] After success: `payingInvoiceId` removed

### Console Logs
```
[paymentService] getInvoices: {...}
[Payment] Lấy danh sách invoice...
[paymentService] createVnpayInvoice: {...}
🔄 Redirecting to VNPay: https://...
[PaymentSuccess] VNPay callback: 00, txnRef
📄 [PaymentSuccess] Processing invoice payment: 33
✅ [PaymentSuccess] Invoice paid successfully!
```

---

## ⚡ Quick Test Commands

### Test API directly with curl/Postman

#### 1. Get Invoices
```bash
GET http://localhost:5000/api/payment/invoices
Authorization: Bearer YOUR_TOKEN
```

#### 2. Create VNPay Invoice
```bash
POST http://localhost:5000/api/vnpay/create-invoice
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "invoiceId": 2,
  "orderInfo": "Thanh toán hóa đơn #2"
}
```

#### 3. Pay Invoice
```bash
PATCH http://localhost:5000/api/payment/12/pay
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "paymentMethod": "CASH"
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Invoices not loading
**Check:**
- Backend running?
- User logged in?
- Token valid?
- API endpoint correct?

### Issue 2: VNPay redirect fails
**Check:**
- VNPay URL received?
- localStorage saved?
- Browser allows redirect?

### Issue 3: PaymentSuccess not detecting invoice
**Check:**
- `payingInvoiceId` in localStorage?
- URL has `code=00`?
- useRef preventing double execution?

### Issue 4: Invoice status not updating
**Check:**
- API call succeeds?
- fetchInvoices() called after payment?
- Backend actually updated status?

---

## 📊 Expected API Responses

### GET /api/payment/invoices
```json
{
  "success": true,
  "data": [
    {
      "InvoiceId": 33,
      "UserId": 28,
      "CompanyId": null,
      "SessionId": 42,
      "MonthYear": null,
      "TotalAmount": 192000,
      "PaidStatus": "PENDING",
      "CreatedAt": null
    }
  ]
}
```

### POST /api/vnpay/create-invoice
```json
{
  "success": true,
  "data": {
    "url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "txnRef": "INV_2_28_1762698993474",
    "amount": 154000
  },
  "message": "Tạo URL thanh toán VNPay cho invoice thành công."
}
```

### PATCH /api/payment/:id/pay
```json
{
  "success": true,
  "message": "Invoice paid successfully"
}
```

---

## ✅ Final Verification

Before considering feature complete:
- [ ] All test cases pass
- [ ] No console errors
- [ ] UI responsive on all devices
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Success/fail messages clear
- [ ] Documentation complete
- [ ] Code reviewed
