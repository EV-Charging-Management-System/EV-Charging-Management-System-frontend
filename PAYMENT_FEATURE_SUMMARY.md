# 📄 Payment Feature - Tính Năng Quản Lý Hóa Đơn

## 🎯 Tổng Quan

Tính năng quản lý hóa đơn cho phép người dùng:
- Xem danh sách các hóa đơn (invoices) của mình
- Chọn phương thức thanh toán (VNPay, Ví EV, Tiền mặt)
- Thanh toán hóa đơn thông qua VNPay
- Xử lý callback sau khi thanh toán thành công

## 📁 Files Đã Tạo/Chỉnh Sửa

### 1. **paymentService.ts** (MỚI)
**Đường dẫn:** `src/services/paymentService.ts`

**Chức năng:**
- `getInvoices()`: Lấy danh sách hóa đơn của user đang đăng nhập
  - API: `GET /api/payment/invoices`
  
- `payInvoice(invoiceId, payload)`: Thanh toán hóa đơn
  - API: `PATCH /api/payment/:invoiceId/pay`
  - Body: `{ paymentMethod: "CASH" | "VNPAY" | "WALLET" }`
  
- `createVnpayInvoice(payload)`: Tạo URL thanh toán VNPay cho hóa đơn
  - API: `POST /api/vnpay/create-invoice`
  - Body: `{ invoiceId: number, orderInfo: string }`

**Interfaces:**
```typescript
interface Invoice {
  InvoiceId: number;
  UserId: number;
  CompanyId: number | null;
  SessionId: number;
  MonthYear: number | null;
  TotalAmount: number;
  PaidStatus: string; // "PENDING" | "PAID" | "FAILED"
  CreatedAt: string | null;
}
```

### 2. **Payment.tsx** (CẬP NHẬT)
**Đường dẫn:** `src/pages/EV-Driver/Payment.tsx`

**Chức năng chính:**
- ✅ Hiển thị danh sách hóa đơn của user
- ✅ Chọn phương thức thanh toán (VNPay mặc định)
- ✅ Hiển thị trạng thái hóa đơn (PENDING, PAID, FAILED)
- ✅ Thanh toán hóa đơn với VNPay
- ✅ Loading states và error handling

**Luồng thanh toán:**

#### 1. **Thanh toán với VNPay:**
```
User click "Thanh toán ngay" 
  → Gọi createVnpayInvoice() để tạo URL thanh toán
  → Lưu invoiceId và paymentMethod vào localStorage
  → Redirect đến VNPay
  → User thanh toán trên VNPay
  → VNPay redirect về /payment-success
  → PaymentSuccess.tsx xử lý callback
  → Gọi payInvoice() để cập nhật trạng thái
  → Redirect về /payment
```

#### 2. **Thanh toán với CASH/WALLET:**
```
User click "Thanh toán ngay"
  → Gọi trực tiếp payInvoice() với paymentMethod
  → Cập nhật trạng thái ngay lập tức
  → Reload danh sách hóa đơn
```

**UI Components:**
- Payment method selector (3 nút: VNPay, Ví EV, Tiền mặt)
- Invoice grid (hiển thị danh sách hóa đơn)
- Invoice cards (thông tin chi tiết từng hóa đơn)
- Status badges (PAID = xanh, PENDING = vàng, FAILED = đỏ)
- Pay button (chỉ hiện với hóa đơn PENDING)

### 3. **PaymentSuccess.tsx** (CẬP NHẬT)
**Đường dẫn:** `src/pages/EV-Driver/PaymentSuccess.tsx`

**Chức năng:**
- ✅ Xử lý callback từ VNPay sau thanh toán
- ✅ Phân biệt 3 loại thanh toán:
  - **Invoice**: Thanh toán hóa đơn
  - **Booking**: Đặt lịch sạc xe
  - **Premium**: Mua gói Premium

**Luồng xử lý:**
```typescript
// Khi VNPay redirect về với code=00 (thành công)
1. Kiểm tra localStorage:
   - Nếu có "payingInvoiceId" → Thanh toán Invoice
   - Nếu có "bookingPayload" → Tạo Booking
   - Không có gì → Thanh toán Premium

2. Xử lý theo loại:
   - Invoice: Gọi payInvoice() → Redirect về /payment sau 3s
   - Booking: Gọi createBooking() → Hiển thị thành công
   - Premium: Hiển thị thông tin membership

3. Xóa localStorage sau khi xử lý thành công
```

### 4. **Payment.css** (CẬP NHẬT)
**Đường dẫn:** `src/css/Payment.css`

**Styles mới:**
- `.payment-method-selector`: Khung chọn phương thức
- `.method-btn`: Nút chọn phương thức (có state active)
- `.invoice-grid`: Grid layout cho danh sách hóa đơn
- `.invoice-card`: Card hiển thị từng hóa đơn
- `.status-badge`: Badge trạng thái (paid/pending/failed)
- `.pay-btn`: Nút thanh toán
- `.paid-badge`: Badge "Đã thanh toán"
- `.loading-container`, `.error-container`: States UI
- `.success-message`: Thông báo thành công

## 🔄 Luồng Hoạt Động Chi Tiết

### Scenario 1: User thanh toán hóa đơn với VNPay

```
1. User vào trang /payment
   → Component mount → useEffect gọi getInvoices()
   → Hiển thị danh sách hóa đơn

2. User chọn phương thức "VNPay" (mặc định)
   → State: selectedPaymentMethod = "VNPAY"

3. User click "Thanh toán ngay" trên một hóa đơn PENDING
   → handlePayInvoice(invoice) được gọi
   → setPayingInvoiceId(invoice.InvoiceId) // Disable button
   → Gọi createVnpayInvoice({
       invoiceId: invoice.InvoiceId,
       orderInfo: "Thanh toán hóa đơn #12"
     })
   → Nhận response với URL VNPay
   → Lưu localStorage:
      - "payingInvoiceId": "12"
      - "invoicePaymentMethod": "VNPAY"
   → window.location.href = vnpayUrl (redirect)

4. User thanh toán trên VNPay
   → VNPay redirect về:
      /payment-success?code=00&txnRef=abc123&vnp_Amount=19200000

5. PaymentSuccess component mount
   → useEffect phát hiện code=00
   → Đọc localStorage thấy "payingInvoiceId"
   → Gọi payInvoice(12, { paymentMethod: "VNPAY" })
   → Backend cập nhật PaidStatus = "PAID"
   → Xóa localStorage
   → Hiển thị "Thanh toán thành công!"
   → Sau 3s: navigate("/payment")

6. User quay về /payment
   → Hóa đơn #12 đã chuyển sang trạng thái "PAID"
```

### Scenario 2: User thanh toán bằng Tiền mặt/Ví

```
1. User chọn phương thức "Tiền mặt" hoặc "Ví EV"
   → selectedPaymentMethod = "CASH" | "WALLET"

2. User click "Thanh toán ngay"
   → handlePayInvoice() gọi trực tiếp:
      payInvoice(invoiceId, { paymentMethod: "CASH" })
   → Backend xử lý và trả về success
   → Alert "✅ Thanh toán thành công!"
   → Gọi fetchInvoices() để reload danh sách
   → Hóa đơn cập nhật trạng thái ngay lập tức
```

## 🎨 UI/UX Features

### 1. **Payment Method Selector**
- 3 nút tròn: VNPay, Ví EV, Tiền mặt
- Active state: gradient xanh sáng
- Hover effect: scale + glow

### 2. **Invoice Card**
- Header: ID + ngày tạo + badge trạng thái
- Details: Session ID, Company ID, tháng/năm, tổng tiền
- Footer: 
  - Nếu PENDING → Nút "Thanh toán ngay"
  - Nếu PAID → Badge "Đã thanh toán"

### 3. **Status Badges**
- **PAID**: ✅ Xanh lá (`#00ff88`)
- **PENDING**: ⏰ Vàng (`#ffaa00`)
- **FAILED**: ❌ Đỏ (`#ff6b6b`)

### 4. **Loading States**
- Spinner khi load danh sách
- Button disabled + spinner khi đang thanh toán
- Skeleton loading (có thể thêm)

### 5. **Error Handling**
- Error message với nút "Thử lại"
- Empty state: "Bạn chưa có hóa đơn nào"

## 🔐 Security & Best Practices

### 1. **LocalStorage Management**
```typescript
// Trước khi redirect VNPay
localStorage.setItem("payingInvoiceId", invoiceId.toString());
localStorage.setItem("invoicePaymentMethod", "VNPAY");

// Sau khi xử lý thành công
localStorage.removeItem("payingInvoiceId");
localStorage.removeItem("invoicePaymentMethod");
```

### 2. **Prevent Double Execution**
```typescript
const hasRun = useRef(false);
if (hasRun.current) return;
hasRun.current = true;
```

### 3. **Error Handling**
- Try-catch cho tất cả API calls
- Hiển thị error message rõ ràng
- Fallback UI cho mọi trường hợp

## 📱 Responsive Design

- Grid auto-fit: 380px minimum
- Mobile: 1 column layout
- Tablet: 2 columns
- Desktop: 3+ columns

## 🚀 APIs Sử Dụng

### 1. GET /api/payment/invoices
**Response:**
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

### 2. PATCH /api/payment/:invoiceId/pay
**Request:**
```json
{
  "paymentMethod": "CASH"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Invoice paid successfully"
}
```

### 3. POST /api/vnpay/create-invoice
**Request:**
```json
{
  "invoiceId": 2,
  "orderInfo": "Thanh toán hóa đơn #2"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...",
    "txnRef": "INV_2_28_1762698993474",
    "amount": 154000
  }
}
```

## ✅ Checklist Hoàn Thành

- [x] Tạo paymentService.ts với 3 API functions
- [x] Cập nhật Payment.tsx với UI danh sách hóa đơn
- [x] Implement payment method selector
- [x] Implement VNPay payment flow
- [x] Cập nhật PaymentSuccess.tsx xử lý invoice callback
- [x] Cập nhật Payment.css với styles mới
- [x] Handle loading & error states
- [x] Responsive design
- [x] LocalStorage management
- [x] Prevent double execution

## 🔮 Tính Năng Có Thể Mở Rộng

1. **Filter & Search**: Lọc theo trạng thái, tìm kiếm theo ID
2. **Sort**: Sắp xếp theo ngày, số tiền
3. **Pagination**: Phân trang cho nhiều hóa đơn
4. **Export**: Xuất PDF/Excel
5. **Invoice Details Modal**: Xem chi tiết đầy đủ
6. **Payment History**: Lịch sử các giao dịch
7. **Auto-refresh**: Tự động cập nhật trạng thái

## 🎓 Ghi Chú Quan Trọng

⚠️ **QUAN TRỌNG**: Luồng thanh toán Invoice tương tự Booking
- Trước khi redirect VNPay → Lưu thông tin vào localStorage
- VNPay callback về /payment-success
- PaymentSuccess xử lý → Gọi API pay invoice
- Redirect về trang gốc

⚠️ **Phân biệt 3 loại thanh toán**:
- Check "payingInvoiceId" → Invoice
- Check "bookingPayload" → Booking  
- Không có → Premium

---

**Ngày tạo:** 2025-01-09  
**Developer:** GitHub Copilot  
**Version:** 1.0.0
