# ChargingSchedule Components

Folder này chứa tất cả các components và hooks cho trang **ChargingSchedule**.

## 📁 Cấu trúc

```
chargingSchedule/
├── index.ts                    # Export tất cả
├── types.ts                    # TypeScript interfaces
├── useBookings.ts              # Hook fetch bookings của user
├── ScheduleHeader.tsx          # Component header với nút đặt lịch
├── BookingCard.tsx             # Component card cho 1 booking
├── BookingList.tsx             # Component danh sách bookings
├── EmptyState.tsx              # Component khi không có booking
└── README.md                   # File này
```

## 🧩 Components

### 1. **ScheduleHeader**
```tsx
<ScheduleHeader />
```
- Hiển thị tiêu đề "Lịch Đặt Sạc"
- Subtitle mô tả
- Nút "Đặt Lịch Mới" → navigate đến booking page
- Không cần props (tự xử lý navigation)

### 2. **BookingCard**
```tsx
<BookingCard 
  booking={booking} 
  onStartCharging={handleStartCharging} 
/>
```
- Card hiển thị chi tiết 1 booking
- Props:
  - `booking`: FormattedBooking - Thông tin booking
  - `onStartCharging`: Function - Handler bắt đầu sạc

**Thông tin hiển thị:**
- 📍 Tên trạm sạc
- 📅 Thời gian bắt đầu
- 🚗 Xe và biển số
- 💰 Tiền đặt cọc
- #️⃣ Mã đặt (QR code)
- ✅ Trạng thái (Badge)
- 🔋 Nút "Bắt đầu sạc"

### 3. **BookingList**
```tsx
<BookingList 
  bookings={bookings} 
  loading={loading} 
  onStartCharging={handleStartCharging} 
/>
```
- Quản lý hiển thị danh sách bookings
- Props:
  - `bookings`: FormattedBooking[] - Danh sách bookings
  - `loading`: boolean - Đang loading
  - `onStartCharging`: Function - Handler bắt đầu sạc

**States:**
- Loading: Hiển thị spinner
- Empty: Hiển thị EmptyState
- Data: Render danh sách BookingCard

### 4. **EmptyState**
```tsx
<EmptyState />
```
- Hiển thị message khi không có booking
- Không cần props
- UI đơn giản với text centered

## 🎣 Custom Hook

### **useBookings()**
```tsx
const { bookings, loading, error } = useBookings()
```

**Chức năng:**
1. Auto-fetch user profile để lấy userId
2. Fetch bookings của user từ API
3. **Lọc chỉ bookings có Status = "ACTIVE"**
4. Format dữ liệu từ backend sang UI format
5. Handle loading và error states

**Returns:**
- `bookings`: FormattedBooking[] - Danh sách bookings đã format
- `loading`: boolean - Đang loading
- `error`: string | null - Lỗi nếu có

**Format logic:**
```typescript
{
  id: BookingId,
  stationName: StationName || 'Trạm Sạc',
  startTime: formatted date time (vi-VN),
  vehicle: VehicleName || 'Chưa cập nhật',
  plate: LicensePlate || 'N/A',
  deposit: formatted VND currency,
  qr: First 8 chars of QR code,
  status: 'Đã xác nhận'
}
```

## 📝 Types

### **RawBooking**
```typescript
// Data từ API backend
interface RawBooking {
  BookingId: number
  StationName?: string
  StartTime: string
  VehicleName?: string
  LicensePlate?: string
  DepositAmount?: number
  QR?: string
  Status: string  // 'ACTIVE', 'COMPLETED', 'CANCELLED'
}
```

### **FormattedBooking**
```typescript
// Data đã format cho UI
interface FormattedBooking {
  id: number
  stationName: string
  startTime: string        // "09/11/2025, 14:30"
  vehicle: string
  plate: string
  deposit: string          // "30,000 ₫"
  qr: string              // First 8 chars
  status: string          // "Đã xác nhận"
}
```

## 🔄 Flow hoạt động

```
1. Component mount
   ↓
2. useBookings() → Fetch user profile
   ↓
3. Get userId from profile
   ↓
4. Fetch bookings by userId
   ↓
5. Filter: Status === 'ACTIVE'
   ↓
6. Format data → FormattedBooking[]
   ↓
7. Render BookingList
   ↓
8. User clicks "Bắt đầu sạc"
   ↓
9. Navigate to /charging-session with booking data
```

## 📊 So sánh Before/After

### ❌ Trước refactor
- 1 file ~150 dòng
- useEffect logic trong component chính
- UI code lẫn logic
- Khó tái sử dụng

### ✅ Sau refactor
- 7 files nhỏ, rõ ràng
- Logic tách ra hook
- Components độc lập
- Dễ test và maintain

## 🎯 Lợi ích

### 1. **Separation of Concerns** 🎯
- UI components riêng
- Data fetching trong hook
- Types định nghĩa rõ ràng

### 2. **Reusability** ♻️
- `BookingCard` có thể dùng ở trang khác
- `useBookings` hook có thể dùng lại
- `EmptyState` reusable

### 3. **Maintainability** 🔧
- Bug ở card → sửa BookingCard.tsx
- Bug fetch data → sửa useBookings.ts
- Dễ tìm và fix

### 4. **Testability** ✅
```tsx
// Test hook
describe('useBookings', () => {
  it('should fetch and filter active bookings', async () => {
    const { result } = renderHook(() => useBookings())
    await waitFor(() => {
      expect(result.current.bookings).toHaveLength(2)
      expect(result.current.bookings[0].status).toBe('Đã xác nhận')
    })
  })
})

// Test component
describe('BookingCard', () => {
  it('should call onStartCharging when button clicked', () => {
    const onStartCharging = jest.fn()
    render(<BookingCard booking={mockBooking} onStartCharging={onStartCharging} />)
    fireEvent.click(screen.getByText('Bắt đầu sạc'))
    expect(onStartCharging).toHaveBeenCalledWith(mockBooking)
  })
})
```

### 5. **Type Safety** 🛡️
- Full TypeScript types
- Props validation
- IntelliSense support

## 💡 Cách sử dụng trong page

```tsx
import { 
  ScheduleHeader, 
  BookingList, 
  useBookings 
} from '@/components/evdriver/chargingSchedule'

const ChargingSchedule = () => {
  const navigate = useNavigate()
  const { bookings, loading } = useBookings()
  
  const handleStartCharging = (booking) => {
    navigate('/charging-session', { state: { booking } })
  }
  
  return (
    <Container>
      <ScheduleHeader />
      <BookingList 
        bookings={bookings} 
        loading={loading} 
        onStartCharging={handleStartCharging} 
      />
    </Container>
  )
}
```

## 🚀 Tính năng

- ✅ Auto-fetch user bookings
- ✅ Filter only ACTIVE status
- ✅ Format date time (vi-VN locale)
- ✅ Format currency (VND)
- ✅ Loading spinner
- ✅ Empty state UI
- ✅ Navigate to charging session
- ✅ Responsive design (React Bootstrap)
- ✅ Error handling

## 📦 Dependencies

- `react-bootstrap` - UI components (Card, Button, Badge, Spinner)
- `react-icons/fa` - Font Awesome icons
- `react-router-dom` - Navigation

## 🎨 UI Features

- 🎨 React Bootstrap styled
- 🌗 Dark theme compatible
- 📱 Responsive layout
- 🎯 Warning color scheme (yellow/orange)
- ✨ Hover effects
- 📊 Status badges
- 🔄 Loading states

## 🔧 File chính

**ChargingSchedule.tsx** giảm từ ~150 dòng xuống còn ~35 dòng:

```tsx
const ChargingSchedule: React.FC = () => {
  const navigate = useNavigate()
  const { bookings, loading } = useBookings()
  
  const handleStartCharging = (booking: any) => {
    navigate('/charging-session', { state: { booking } })
  }
  
  return (
    <div className='schedule-container bg-dark text-light min-vh-100'>
      <Header />
      <MenuBar />
      <Container className='py-4'>
        <ScheduleHeader />
        <BookingList 
          bookings={bookings} 
          loading={loading} 
          onStartCharging={handleStartCharging} 
        />
      </Container>
      <Footer />
    </div>
  )
}
```

## ✨ Kết luận

Code đã được refactor thành công với:
- ✅ 7 files có tổ chức tốt
- ✅ 1 custom hook xử lý logic
- ✅ 4 components tái sử dụng được
- ✅ Full TypeScript types
- ✅ File chính giảm 77% số dòng
- ✅ Dễ maintain và scale

Happy coding! 🎉
