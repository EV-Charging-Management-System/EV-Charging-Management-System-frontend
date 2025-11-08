# BookingOnlineStation Components

Folder này chứa tất cả các components và hooks cho trang **BookingOnlineStation**.

## 📁 Cấu trúc

```
bookingOnlineStation/
├── index.ts                  # Export tất cả components và hooks
├── types.ts                  # TypeScript types và interfaces
├── useStations.ts            # Custom hook để fetch stations từ API
├── MapSection.tsx            # Component hiển thị Google Map với markers
├── StationInfoWindow.tsx     # Component InfoWindow khi click marker
├── StationList.tsx           # Component danh sách trạm sạc
├── StationCard.tsx           # Component card cho mỗi trạm sạc
├── PageHeader.tsx            # Component header của trang
└── README.md                 # File này
```

## 🧩 Components

### 1. **MapSection**
- Hiển thị Google Map với các marker trạm sạc
- Props:
  - `isLoaded`: Boolean - Google Maps API đã load chưa
  - `center`: Object - Tọa độ trung tâm map
  - `stations`: Array - Danh sách trạm sạc
  - `activeStation`: number | null - ID trạm đang được chọn
  - `onMarkerClick`: Function - Handler khi click marker
  - `onInfoWindowClose`: Function - Handler khi đóng InfoWindow

### 2. **StationList**
- Hiển thị danh sách trạm sạc dạng list
- Props:
  - `stations`: Array - Danh sách trạm sạc
  - `activeStation`: number | null - ID trạm đang được chọn
  - `onStationHover`: Function - Handler khi hover vào trạm

### 3. **StationCard**
- Hiển thị thông tin 1 trạm sạc dạng card
- Props:
  - `station`: StationData - Thông tin trạm sạc
  - `isActive`: boolean - Trạm có đang được chọn không
  - `onMouseEnter`: Function - Handler khi hover vào
  - `onMouseLeave`: Function - Handler khi hover ra

### 4. **StationInfoWindow**
- Hiển thị popup thông tin khi click marker trên map
- Props:
  - `station`: StationData - Thông tin trạm sạc
  - `onClose`: Function - Handler khi đóng popup

### 5. **PageHeader**
- Hiển thị tiêu đề trang và lời chào user
- Props:
  - `currentUser`: any | null - Thông tin user hiện tại

## 🎣 Custom Hooks

### **useStations()**
- Fetch danh sách trạm sạc từ API
- Tự động map dữ liệu từ backend sang format UI
- Returns:
  - `stations`: Array<StationData> - Danh sách trạm
  - `loadingStations`: boolean - Đang loading
  - `stationsError`: string | null - Lỗi nếu có

## 📝 Types

### **StationData**
```typescript
interface StationData {
  id: number
  name: string
  address: string
  lat: number
  lng: number
  empty: number      // Số chỗ trống
  total: number      // Tổng số chỗ
  color: 'green' | 'orange' | 'gray'
  raw: any          // Dữ liệu gốc từ backend
}
```

### **MapCenter**
```typescript
interface MapCenter {
  lat: number
  lng: number
}
```

## 🔄 Cách sử dụng

```tsx
import { 
  MapSection, 
  StationList, 
  PageHeader, 
  useStations 
} from '../../components/evdriver/bookingOnlineStation'

// Trong component
const { stations, loadingStations, stationsError } = useStations()

<MapSection
  isLoaded={isLoaded}
  center={center}
  stations={stations}
  activeStation={activeStation}
  onMarkerClick={setActiveStation}
  onInfoWindowClose={() => setActiveStation(null)}
/>

<StationList 
  stations={stations} 
  activeStation={activeStation} 
  onStationHover={setActiveStation} 
/>
```

## ✨ Lợi ích của việc refactor

1. **Tách biệt trách nhiệm**: Mỗi component có 1 nhiệm vụ cụ thể
2. **Dễ bảo trì**: Code được tổ chức rõ ràng, dễ tìm và sửa
3. **Tái sử dụng**: Các component có thể dùng lại ở nơi khác
4. **Dễ test**: Component nhỏ dễ viết unit test
5. **Type-safe**: TypeScript types rõ ràng cho tất cả props
6. **Custom hooks**: Logic phức tạp được tách riêng, dễ quản lý

## 🎯 Next Steps

- Thêm loading state UI cho `MapSection`
- Thêm error handling UI
- Thêm unit tests cho các component
- Thêm Storybook stories để document components
