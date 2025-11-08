# BookingDetail Components

Folder này chứa tất cả các components và hooks cho trang **BookingDetail**.

## 📁 Cấu trúc

```
bookingDetail/
├── index.ts                  # Export tất cả components và hooks
├── types.ts                  # TypeScript types và interfaces
├── useBookingForm.ts         # Custom hook quản lý form và user data
├── usePoints.ts              # Custom hook fetch danh sách điểm sạc
├── usePorts.ts               # Custom hook fetch danh sách cổng sạc
├── MapSection.tsx            # Component hiển thị map image
├── BookingForm.tsx           # Component form đặt lịch sạc
├── PointGrid.tsx             # Component lưới các điểm sạc
├── PointCard.tsx             # Component card cho mỗi điểm sạc
└── README.md                 # File này
```

## 🧩 Components

### 1. **MapSection**
- Hiển thị hình ảnh bản đồ chi tiết trạm
- Component đơn giản, không có props

```tsx
<MapSection />
```

### 2. **BookingForm**
- Form đặt lịch sạc với thông tin user, xe, giờ sạc, cổng
- Props:
  - `formData`: BookingFormData - Dữ liệu form
  - `ports`: Port[] - Danh sách cổng sạc
  - `selectedPortId`: number | null - Cổng đang chọn
  - `payLoading`: boolean - Đang xử lý thanh toán
  - `onFormDataChange`: Function - Handler cập nhật form data
  - `onPortChange`: Function - Handler chọn cổng
  - `onSubmit`: Function - Handler submit form

```tsx
<BookingForm
  formData={formData}
  ports={ports}
  selectedPortId={selectedPortId}
  payLoading={payLoading}
  onFormDataChange={(data) => setFormData({ ...formData, ...data })}
  onPortChange={setSelectedPortId}
  onSubmit={handleSubmit}
/>
```

### 3. **PointGrid**
- Hiển thị lưới các điểm sạc có thể chọn
- Props:
  - `points`: Point[] - Danh sách điểm sạc
  - `selectedPointId`: number | null - Điểm đang chọn
  - `onSelectPoint`: Function - Handler chọn điểm

```tsx
<PointGrid 
  points={points} 
  selectedPointId={selectedPointId} 
  onSelectPoint={setSelectedPointId} 
/>
```

### 4. **PointCard**
- Card hiển thị thông tin 1 điểm sạc
- Props:
  - `point`: Point - Thông tin điểm sạc
  - `isSelected`: boolean - Điểm có đang được chọn
  - `onSelect`: Function - Handler khi click chọn

```tsx
<PointCard
  point={point}
  isSelected={selectedPointId === point.PointId}
  onSelect={() => onSelectPoint(point.PointId)}
/>
```

## 🎣 Custom Hooks

### **useBookingForm()**
- Quản lý form data và tự động load thông tin user
- Returns:
  - `formData`: BookingFormData - Dữ liệu form
  - `setFormData`: Function - Update form data

```tsx
const { formData, setFormData } = useBookingForm()
```

### **usePoints(stationId)**
- Fetch danh sách điểm sạc theo stationId
- Params:
  - `stationId`: number - ID trạm sạc
- Returns:
  - `points`: Point[] - Danh sách điểm
  - `loadingPoints`: boolean - Đang loading
  - `pointsError`: string | null - Lỗi nếu có

```tsx
const { points, loadingPoints, pointsError } = usePoints(stationId)
```

### **usePorts(selectedPointId)**
- Fetch danh sách cổng sạc theo pointId
- Params:
  - `selectedPointId`: number | null - ID điểm đang chọn
- Returns:
  - `ports`: Port[] - Danh sách cổng
  - `loadingPorts`: boolean - Đang loading
  - `portsError`: string | null - Lỗi nếu có

```tsx
const { ports, loadingPorts, portsError } = usePorts(selectedPointId)
```

## 📝 Types

### **Point**
```typescript
interface Point {
  PointId: number
  StationId: number
  ChargingPointStatus: string  // 'AVAILABLE', 'BOOKED', 'MAINTENANCE'
  NumberOfPort?: number
}
```

### **Port**
```typescript
interface Port {
  PortId: number
  PointId: number
  PortType: string
  PortStatus: string  // 'AVAILABLE', 'OCCUPIED'
}
```

### **BookingFormData**
```typescript
interface BookingFormData {
  name: string
  userId: string
  email: string
  carBrand: string
  vehicleId: string
  time: string
}
```

### **BookingPayload**
```typescript
interface BookingPayload {
  stationId: number
  pointId: number
  portId: number
  vehicleId: number
  startTime: string
  depositAmount: number
  userId: number
  carBrand: string
}
```

### **VnpayPayload**
```typescript
interface VnpayPayload {
  userId: number
  amount: number
}
```

## 🔄 Flow hoạt động

1. **Load user info**: `useBookingForm()` tự động fetch thông tin user
2. **Load points**: `usePoints(stationId)` load danh sách điểm sạc
3. **User chọn point**: Click vào `PointCard` → cập nhật `selectedPointId`
4. **Load ports**: `usePorts(selectedPointId)` tự động load cổng khi point được chọn
5. **User điền form**: Chọn xe, giờ, cổng sạc
6. **Submit**: Tạo booking payload → Gọi VNPay API → Mở tab thanh toán

## 🎯 Lợi ích

1. **Tách biệt logic**: Hooks xử lý data fetching riêng
2. **Component nhỏ gọn**: Mỗi component có trách nhiệm rõ ràng
3. **Dễ test**: Test từng hook và component độc lập
4. **Type-safe**: Full TypeScript types cho tất cả
5. **Reusable**: Components và hooks có thể dùng lại

## 📊 So sánh Before/After

### ❌ Trước refactor
- 1 file ~280 dòng
- Logic lẫn lộn với UI
- Khó maintain và debug
- Không thể tái sử dụng

### ✅ Sau refactor
- 9 files nhỏ, rõ ràng
- Logic tách riêng vào hooks
- Dễ maintain và debug
- Components có thể tái sử dụng

## 💡 Cách sử dụng trong page

```tsx
import {
  MapSection,
  BookingForm,
  PointGrid,
  useBookingForm,
  usePoints,
  usePorts
} from '@/components/evdriver/bookingDetail'

const BookingDetail = () => {
  const { id } = useParams()
  const stationId = Number(id)
  
  // Hooks
  const { formData, setFormData } = useBookingForm()
  const { points } = usePoints(stationId)
  const { ports } = usePorts(selectedPointId)
  
  // State
  const [selectedPointId, setSelectedPointId] = useState(null)
  const [selectedPortId, setSelectedPortId] = useState(null)
  
  return (
    <div>
      <MapSection />
      <BookingForm {...props} />
      <PointGrid {...props} />
    </div>
  )
}
```

## 🚀 Tính năng

- ✅ Auto-load user info khi mount
- ✅ Auto-load points khi có stationId
- ✅ Auto-load ports khi chọn point
- ✅ Auto-select first available port
- ✅ Form validation
- ✅ VNPay payment integration
- ✅ LocalStorage booking payload
- ✅ Loading states
- ✅ Error handling

Happy coding! 🎉
