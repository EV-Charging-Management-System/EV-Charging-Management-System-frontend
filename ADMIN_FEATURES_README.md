# 📋 Tài liệu Bổ sung Tính năng Admin

## 🎯 Tổng quan
Đã bổ sung các API và UI cho quản lý **Charging Points** và **Charging Ports** trong trang Admin Dashboard.

---

## 🔧 API đã thêm vào `adminService.ts`

### 1. **Xóa trạm sạc**
```typescript
deleteStation(stationId: number)
```
- **Endpoint**: `PATCH /api/admin/deleteStation`
- **Body**: `{ stationId: number }`

### 2. **Quản lý Point**

#### Tạo Point
```typescript
createPoint(stationId: number, numberOfPort: number)
```
- **Endpoint**: `POST /api/admin/createPoint`
- **Body**: `{ stationId, numberOfPort }`

#### Cập nhật Point
```typescript
updatePoint(pointId: number, numberOfPort: number, chargingPointStatus: string)
```
- **Endpoint**: `PUT /api/admin/updatePoint`
- **Body**: `{ pointId, numberOfPort, chargingPointStatus }`

#### Xóa Point (chỉ khi không còn port nào)
```typescript
deletePoint(pointId: number)
```
- **Endpoint**: `DELETE /api/admin/deletePoint`
- **Body**: `{ pointId }`

#### Lấy danh sách Points theo Station
```typescript
getPointsByStation(stationId: number)
```
- **Endpoint**: `GET /api/admin/points/{stationId}`

### 3. **Quản lý Port**

#### Tạo Port
```typescript
createPort(
  pointId: number,
  portName: string,
  portType: string,
  portTypeOfKwh: number,
  portTypePrice: number,
  portStatus: string
)
```
- **Endpoint**: `POST /api/admin/createPort`
- **Body**: `{ pointId, portName, portType, portTypeOfKwh, portTypePrice, portStatus }`

#### Cập nhật Port
```typescript
updatePort(
  portId: number,
  portName: string,
  portType: string,
  chargingPortType: string,
  portTypeOfKwh: number,
  portTypePrice: number,
  portStatus: string
)
```
- **Endpoint**: `PUT /api/admin/updatePort`
- **Body**: `{ portId, portName, portType, chargingPortType, portTypeOfKwh, portTypePrice, portStatus }`

#### Xóa Port
```typescript
deletePort(portId: number)
```
- **Endpoint**: `DELETE /api/admin/deletePort`
- **Body**: `{ portId }`

#### Lấy danh sách Ports theo Point
```typescript
getPortsByPoint(pointId: number)
```
- **Endpoint**: `GET /api/admin/ports/{pointId}`

---

## 🎨 Components UI đã tạo

### 1. **PointTable.tsx**
Component quản lý Charging Points với các tính năng:
- ✅ Hiển thị danh sách Points của một Station
- ➕ Thêm Point mới
- ✏️ Chỉnh sửa Point (số lượng port, trạng thái)
- 🗑️ Xóa Point (chỉ khi không còn Port nào)
- 📋 Xem danh sách Ports của Point

**Props:**
```typescript
{
  points: Point[];
  stationId: number;
  onAdd: (point: Partial<Point>) => Promise<void>;
  onEdit: (point: Point) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onViewPorts: (pointId: number) => void;
}
```

### 2. **PortTable.tsx**
Component quản lý Charging Ports với các tính năng:
- ✅ Hiển thị danh sách Ports của một Point
- ➕ Thêm Port mới (Tên, Loại, Công suất, Giá, Trạng thái)
- ✏️ Chỉnh sửa Port
- 🗑️ Xóa Port

**Props:**
```typescript
{
  ports: Port[];
  pointId: number;
  onAdd: (port: Partial<Port>) => Promise<void>;
  onEdit: (port: Port) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}
```

---

## 🖥️ Cập nhật AdminDashboard

### Tabs mới trong Sidebar:
1. **📍 Charging Points** - Quản lý điểm sạc
2. **🔌 Charging Ports** - Quản lý cổng sạc

### Workflow sử dụng:
1. Chọn **Trạm sạc** → Nhấn "Points" để xem danh sách Points
2. Chọn **Point** → Nhấn "📋" để xem danh sách Ports
3. Có thể thêm/sửa/xóa Point và Port trực tiếp

### State mới:
```typescript
const [selectedStationId, setSelectedStationId] = useState<number | null>(null);
const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
const [points, setPoints] = useState<any[]>([]);
const [ports, setPorts] = useState<any[]>([]);
```

### Handlers mới:
- `handleDeleteStation` - Xóa trạm sạc
- `handleAddPoint`, `handleEditPoint`, `handleDeletePoint` - CRUD Point
- `handleAddPort`, `handleEditPort`, `handleDeletePort` - CRUD Port
- `handleViewPoints`, `handleViewPorts` - Chuyển tab và load dữ liệu

---

## 🎨 CSS Styling

Đã thêm vào `AdminDashboard.css`:
- `.table-container` - Container cho bảng
- `.table-header` - Header với title và button thêm
- `.data-table` - Bảng dữ liệu
- `.action-buttons`, `.btn-icon` - Các nút hành động
- `.status-badge` - Badge trạng thái (online, offline, available, in_use, maintenance)
- `.badge-type`, `.badge-charging-type` - Badge loại port
- `.modal-overlay`, `.modal-content` - Modal thêm/sửa
- `.form-group`, `.form-row` - Form nhập liệu
- Responsive cho mobile

---

## 🚀 Cách sử dụng

### Từ trang Admin Dashboard:

1. **Xem và quản lý Points:**
   - Vào tab "Trạm sạc"
   - Nhấn nút "Points" ở hàng trạm muốn quản lý
   - Tự động chuyển sang tab "Charging Points"

2. **Thêm Point mới:**
   - Nhấn "➕ Thêm Point"
   - Nhập số lượng Port
   - Nhấn "💾 Lưu"

3. **Sửa Point:**
   - Nhấn icon ✏️ ở Point muốn sửa
   - Thay đổi số lượng Port hoặc trạng thái
   - Nhấn "💾 Lưu"

4. **Xóa Point:**
   - Nhấn icon 🗑️ ở Point muốn xóa
   - Xác nhận xóa (chỉ xóa được khi không còn Port nào)

5. **Xem và quản lý Ports:**
   - Từ tab "Charging Points", nhấn "📋" ở Point muốn xem
   - Tự động chuyển sang tab "Charging Ports"

6. **Thêm Port mới:**
   - Nhấn "➕ Thêm Port"
   - Điền thông tin: Tên, Loại (CCS/CHAdeMO/Type2/Type1), Công suất, Giá, Trạng thái
   - Nhấn "💾 Lưu"

---

## 📊 Data Models

### Point
```typescript
{
  PointId: number;
  StationId: number;
  NumberOfPort: number;
  ChargingPointStatus: "ONLINE" | "OFFLINE";
}
```

### Port
```typescript
{
  PortId: number;
  PointId: number;
  PortName: string;
  PortType: "CCS" | "CHAdeMO" | "Type2" | "Type1";
  ChargingPortType?: "DC" | "AC";
  PortTypeOfKwh: number;
  PortTypePrice: number;
  PortStatus: "AVAILABLE" | "IN_USE" | "MAINTENANCE";
}
```

---

## ✅ Checklist hoàn thành

- [x] Thêm 7 API methods vào `adminService.ts`
- [x] Tạo component `PointTable.tsx`
- [x] Tạo component `PortTable.tsx`
- [x] Cập nhật `AdminDashboard.tsx` với tabs và handlers mới
- [x] Cập nhật `StationTable.tsx` để hỗ trợ xem Points và xóa Station
- [x] Thêm CSS styling cho các components mới
- [x] Fix các TypeScript errors

---

## 🔮 Tính năng có thể mở rộng

1. **Filter & Search**: Tìm kiếm Point/Port theo tên, trạng thái
2. **Bulk Actions**: Xóa/Cập nhật nhiều Point/Port cùng lúc
3. **Export Data**: Xuất danh sách Point/Port ra Excel/CSV
4. **Real-time Status**: Cập nhật trạng thái Point/Port theo real-time
5. **Analytics**: Thống kê sử dụng Port, doanh thu theo Point/Port

---

## 📝 Lưu ý

- **Point chỉ được xóa** khi không còn Port nào
- **Station có thể được xóa** bất kỳ lúc nào thông qua API
- Các trạng thái được hiển thị bằng **badge màu sắc** để dễ phân biệt
- Modal form có **validation** cơ bản cho các trường bắt buộc

---

## 🐛 Troubleshooting

### Lỗi "Point không thể xóa"
- Kiểm tra xem Point có còn Port nào không
- Xóa hết Port trước, sau đó mới xóa Point

### Không thấy danh sách Points/Ports
- Đảm bảo đã chọn Station/Point trước
- Kiểm tra API endpoint và response data structure

### Modal không hiển thị
- Kiểm tra CSS `z-index` của modal
- Đảm bảo không có overlay nào che modal

---

**Ngày cập nhật**: 8 tháng 11, 2025  
**Phiên bản**: 1.0.0
