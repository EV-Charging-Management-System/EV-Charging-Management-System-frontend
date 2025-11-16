# Staff Components Refactoring

## Cấu trúc mới

Các trang của Staff đã được refactor thành các components nhỏ, tách biệt logic và UI, sử dụng React Bootstrap để cải thiện giao diện.

### 📁 Cấu trúc thư mục

```
src/components/staff/
├── homePageStaff/
│   ├── PageHeader.tsx
│   ├── HeroSection.tsx
│   ├── MapBackground.tsx
│   ├── Footer.tsx
│   └── index.ts
│
├── chargingProcess/
│   ├── PageHeader.tsx
│   ├── ActiveSession.tsx
│   ├── SessionCard.tsx
│   ├── WaitingList.tsx
│   ├── useChargingSessions.ts (custom hook)
│   ├── types.ts
│   └── index.ts
│
├── invoice/
│   ├── InvoiceDetail.tsx
│   ├── InvoiceList.tsx
│   ├── PaymentSection.tsx
│   ├── useInvoice.ts (custom hook)
│   ├── types.ts
│   └── index.ts
│
├── location/
│   ├── StationSelector.tsx
│   ├── StationMap.tsx
│   ├── useStations.ts (custom hook)
│   ├── types.ts
│   └── index.ts
│
└── locationDetail/
    ├── StationInfo.tsx
    ├── ChargerGrid.tsx
    ├── BookingForm.tsx
    ├── useLocationDetail.ts (custom hook)
    ├── types.ts
    └── index.ts
```

## 🎯 Các trang đã được refactor

### 1. HomePageStaff
- **PageHeader**: Header với title và profile staff
- **HeroSection**: Phần hero với thông tin chào mừng và nút bắt đầu sạc
- **MapBackground**: Google Maps iframe background
- **Footer**: Footer thông tin

### 2. ChargingProcessStaff
- **PageHeader**: Header trang
- **ActiveSession**: Hiển thị phiên sạc đang diễn ra với progress bar
- **SessionCard**: Card hiển thị thông tin mỗi phiên sạc
- **WaitingList**: Danh sách phiên sạc chờ
- **useChargingSessions**: Custom hook quản lý toàn bộ logic charging sessions

### 3. Invoice
- **InvoiceDetail**: Hiển thị chi tiết một hóa đơn
- **InvoiceList**: Danh sách lịch sử hóa đơn
- **PaymentSection**: Phần thanh toán với button và trạng thái
- **useInvoice**: Custom hook quản lý logic hóa đơn và thanh toán

### 4. Location
- **StationSelector**: Dropdown chọn trạm sạc
- **StationMap**: Google Maps với markers
- **useStations**: Custom hook quản lý danh sách trạm và map state

### 5. LocationDetail
- **StationInfo**: Thông tin trạm sạc
- **ChargerGrid**: Grid hiển thị các điểm sạc
- **BookingForm**: Form đặt phiên sạc (Modal với React Bootstrap)
- **useLocationDetail**: Custom hook quản lý logic booking

## ✨ Cải tiến

### 1. Clean Architecture
- **Tách biệt concerns**: UI components, business logic (hooks), types
- **Reusable components**: Các components có thể tái sử dụng
- **Custom hooks**: Logic tách riêng, dễ test và maintain

### 2. React Bootstrap Integration
- Sử dụng `Card`, `Button`, `Modal`, `Form`, `Badge`, `Alert`, `ProgressBar`
- Responsive design tốt hơn
- UI/UX chuyên nghiệp hơn

### 3. TypeScript Types
- Mỗi module có file `types.ts` riêng
- Type safety đầy đủ
- Autocomplete tốt hơn trong IDE

### 4. Code Quality
- Loại bỏ code dư thừa
- Format code nhất quán
- Comments và documentation đầy đủ

## 🔧 Cách sử dụng

### Import components:
```typescript
// HomePageStaff
import { PageHeader, HeroSection, MapBackground, Footer } from '../../components/staff/homePageStaff';

// ChargingProcessStaff
import { PageHeader, ActiveSession, WaitingList, useChargingSessions } from '../../components/staff/chargingProcess';

// Invoice
import { InvoiceDetail, InvoiceList, PaymentSection, useInvoice } from '../../components/staff/invoice';

// Location
import { StationSelector, StationMap, useStations } from '../../components/staff/location';

// LocationDetail
import { StationInfo, ChargerGrid, BookingForm, useLocationDetail } from '../../components/staff/locationDetail';
```

## 📝 Lưu ý

- **Không làm ảnh hưởng logic**: Tất cả logic nghiệp vụ được giữ nguyên
- **Backward compatible**: Các API calls và data flow không thay đổi
- **Easy to extend**: Dễ dàng thêm features mới hoặc modify components

## 🚀 Next Steps

- Thêm unit tests cho các custom hooks
- Thêm error boundaries
- Implement loading skeletons
- Optimize performance với React.memo nếu cần
