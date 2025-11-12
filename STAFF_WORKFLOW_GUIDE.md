# 📘 HƯỚNG DẪN LUỒNG STAFF - EV CHARGING SYSTEM

## 🎯 Tổng quan luồng xử lý

```
HomePage Staff → Location → LocationDetail → ChargingProcess → Invoice
     (1)           (2)           (3)              (4)            (5)
```

---

## 📍 Chi tiết từng bước

### **1️⃣ HomePage Staff** (`/staff`)
- **File**: `src/pages/Staff/HomePageStaff.tsx`
- **CSS**: `src/css/HomePageStaff.css`
- **Chức năng**: 
  - Trang chủ của staff với sidebar cố định (không animation)
  - Nút "Bắt đầu sạc" → Navigate đến `/staff/location`
- **Navigation**: 
  ```tsx
  navigate('/staff/location')
  ```

---

### **2️⃣ Location** (`/staff/location`)
- **File**: `src/pages/Staff/Location.tsx`
- **CSS**: `src/css/Location.css`
- **Service**: `src/services/locationService.ts`
- **Chức năng**:
  - Hiển thị Google Maps với markers cho tất cả trạm sạc
  - Gọi API: `getAllStations()` và `getStaffAddress()`
  - Click vào marker → Navigate đến `/staff/locationDetail/:address`
- **Navigation**:
  ```tsx
  navigate(`/staff/locationDetail/${encodeURIComponent(station.address)}`)
  ```

---

### **3️⃣ LocationDetail** (`/staff/locationDetail/:address`)
- **File**: `src/pages/Staff/LocationDetail.tsx`
- **CSS**: `src/css/LocationDetail.css`
- **Services**: 
  - `locationService.ts` - Lấy thông tin station
  - `chargingpointService.ts` - Lấy charging points & ports
  - `vehicleService.ts` - Tra cứu xe theo biển số
- **Chức năng**:
  - Hiển thị grid các charging points (status: Available/Busy/Maintenance)
  - Click vào point → Mở form đặt phiên sạc
  - **Form booking** có 2 loại:
    - **EV-Driver**: Nhập biển số → Tra cứu userId (nếu có)
    - **Guest**: Không cần biển số, tạo session guest
  - Chọn port → Hiển thị giá, công suất
- **API Calls**:
  ```tsx
  // EV-Driver with userId
  POST /api/charging-session/staff/start
  Body: { licensePlate, stationId, pointId, portId, batteryPercentage, userId }
  
  // Guest
  POST /api/charging-session/guest/start
  Body: { stationId, pointId, portId, battery, batteryPercentage }
  ```
- **Data Flow**:
  - Sau khi tạo session thành công → Lưu `userId` vào localStorage với key `session_{sessionId}_userId`
  - **✅ NAVIGATION**: Tự động chuyển đến `/staff/charging-process`
  ```tsx
  navigate('/staff/charging-process');
  ```

---

### **4️⃣ ChargingProcess** (`/staff/charging-process`)
- **File**: `src/pages/Staff/ChargingProcessStaff.tsx`
- **CSS**: `src/css/ChargingProcessStaff.css`
- **Service**: `src/services/chargingProcessService.ts`, `invoiceService.ts`
- **Chức năng**:
  - Hiển thị danh sách phiên sạc đang hoạt động (Staff & Guest)
  - Click "Bắt đầu sạc" → Nhập % pin ban đầu → Bắt đầu giả lập sạc
  - **Real-time charging simulation**:
    - Battery % tăng từ initialBattery → 100% với tốc độ 1%/2s
    - Tính toán cost theo thời gian: `(elapsedSeconds / 3600) * pricePerKwh`
  - Nút "Dừng sạc" → Kết thúc session
- **API Calls**:
  ```tsx
  // Lấy sessions
  GET /api/staff/station/sessions (Staff sessions)
  GET /api/charging-session/guest/station/:id (Guest sessions)
  
  // Set battery khi bắt đầu
  PUT /api/charging-session/setBatteryPercentage
  Body: { sessionId, batteryPercentage }
  
  // Kết thúc sạc
  PATCH /api/charging-session/staff/:id/end (Staff)
  PATCH /api/charging-session/guest/:id/end (Guest)
  
  // Tạo invoice
  POST /api/charging-session/:id/invoice-staff (Staff with userId)
  POST /api/charging-session/:id/invoice (Guest)
  ```
- **Data Flow sau khi END session**:
  1. Lấy `userId` từ localStorage (key: `session_{sessionId}_userId`)
  2. Nếu có `userId` → Gọi `createInvoiceForStaff(sessionId, userId)`
  3. Nếu không có `userId` → Gọi `getInvoiceBySessionId(sessionId)` (Guest)
  4. **✅ NAVIGATION**: Navigate đến Invoice với data
  ```tsx
  // Staff có userId
  navigate("/staff/invoice", { 
    state: { invoice: normalizedInvoice, raw: created } 
  });
  
  // Guest
  navigate(`/staff/invoice?sessionId=${sessionId}`);
  ```

---

### **5️⃣ Invoice** (`/staff/invoice`)
- **File**: `src/pages/Staff/Invoice.tsx`
- **CSS**: `src/css/Invoice.css`
- **Service**: `invoiceService.ts`
- **Chức năng**:
  - Nhận invoice data từ 2 nguồn:
    - `location.state.invoice` (từ ChargingProcess)
    - `?sessionId=xxx` query param (fallback)
  - Hiển thị thông tin hóa đơn:
    - Invoice ID, Session ID
    - Thời gian bắt đầu/kết thúc
    - Session Price, Penalty Fee, Total Amount
    - Station name, Charger info, Power
    - Battery start → end
  - Nút "Thanh toán" → Gọi payment API
- **API Call**:
  ```tsx
  PATCH /api/payment/:invoiceId/pay
  ```
- **Data Flow**:
  - Sau khi thanh toán thành công → Update `paid: true`, `PaidStatus: "PAID"`
  - Alert "✅ Thanh toán thành công!"

---

## 🗂️ Kiến trúc Services

### **locationService.ts**
```typescript
interface Station {
  StationId: number;
  address: string;
  latitude: number;
  longitude: number;
  StationName?: string;
  ChargingPointNumber?: number;
}

getAllStations(): Promise<Station[]>
getStaffAddress(): Promise<StaffAddress[]>
getStationInfo(address: string): Promise<any>
```

### **chargingpointService.ts**
```typescript
interface ChargingPoint {
  PointId: number;
  ChargingPointName: string;
  ChargingPointStatus: "AVAILABLE" | "BUSY" | "MAINTENANCE";
  PointPrice: number;
  // ...
}

interface ChargingPort {
  PortId: number;
  PortType: string;
  PortTypeOfKwh: number;
  PortTypePrice: number;
  PortStatus: string;
}

getByStationId(stationId: number): Promise<ChargingPoint[]>
getPortsByPoint(pointId: number): Promise<ChargingPort[]>
```

### **chargingProcessService.ts**
```typescript
getPorts(): Promise<any[]>
getStaffSessions(): Promise<any[]>
getGuestSessions(stationId: number): Promise<any[]>
setBatteryPercentage(sessionId: number, battery: number): Promise<any>
endChargingSession(sessionId: number, userType: "staff" | "guest"): Promise<any>
```

### **invoiceService.ts**
```typescript
createInvoiceForStaff(sessionId: number, userId: number): Promise<any>
getInvoiceBySessionId(sessionId: number): Promise<any>
```

### **vehicleService.ts**
```typescript
getVehicleByLicensePlate(plate: string): Promise<Vehicle | null>
// Trả về: vehicleId, userId, companyId, currentBattery
```

---

## 🎨 CSS Architecture - Fixed Sidebar

### **Cấu trúc chung cho tất cả trang Staff:**

```css
/* Wrapper chứa sidebar + content */
.charging-wrapper, .location-wrapper {
  display: flex;
  min-height: 100vh;
}

/* Sidebar cố định bên trái */
.charging-sidebar, .staff-sidebar, .location-sidebar {
  position: fixed;
  left: 0; /* KHÔNG phải -250px */
  top: 0;
  width: 250px;
  height: 100vh;
  background: #1e293b;
  z-index: 100;
  /* KHÔNG có transition */
}

/* Main content với margin-left cố định */
.charging-main-wrapper, .staff-main-wrapper, .location-main-wrapper, .detail-body {
  margin-left: 250px; /* Luôn cố định 250px */
  flex: 1;
  /* KHÔNG có transition */
}

/* Header cũng cần left offset */
.charging-header, .staff-header, .location-header {
  position: fixed;
  top: 0;
  left: 250px; /* Tránh đè lên sidebar */
  right: 0;
  /* KHÔNG có transition */
}

/* Logo, menu, button KHÔNG có opacity: 0 */
.charging-logo, .charging-menu, .logout-btn {
  opacity: 1; /* Luôn hiển thị */
  /* KHÔNG có transition */
}
```

### **❌ ĐÃ XÓA các class sau:**
```css
/* ❌ KHÔNG CÒN */
.charging-sidebar-hover
.staff-sidebar-hover
.location-sidebar-hover

/* ❌ KHÔNG CÒN các hover effects */
.charging-wrapper:hover .charging-sidebar
.location-wrapper:hover .location-sidebar
```

---

## 📦 Component StaffSideBar

**File**: `src/pages/layouts/staffSidebar.tsx`

```tsx
const StaffSideBar = () => {
  const navigate = useNavigate()
  return (
    <>
      <aside> {/* ❌ KHÔNG CÒN class 'charging-sidebar-hover' */}
        <div className='charging-sidebar'>
          <div className='charging-logo'>⚡ EV STAFF</div>
          <nav className='charging-menu'>
            <ul>
              <li onClick={() => navigate('/staff')}>About</li>
              <li onClick={() => navigate('/staff/location')}>Location</li>
              <li onClick={() => navigate('/staff/charging-process')}>Charging Process</li>
              <li onClick={() => navigate('/staff/invoice')}>Invoice</li>
            </ul>
          </nav>
          <button className='logout-btn' onClick={() => navigate('/')}>
            ← Exit
          </button>
        </div>
      </aside>
    </>
  )
}
```

**✅ Đã xóa các menu item không cần thiết:**
- ❌ Sessions
- ❌ Report To Admin
- ❌ Settings

---

## 🔄 Data Flow Summary

### **Tracking userId qua localStorage:**

```typescript
// 1. LocationDetail - Sau khi tạo session
const sessionId = sessionData?.data?.sessionId;
if (sessionId && userId) {
  localStorage.setItem(`session_${sessionId}_userId`, userId);
}

// 2. ChargingProcess - Lấy userId khi kết thúc
const userIdSessionKey = `session_${sessionId}_userId`;
const userId = localStorage.getItem(userIdSessionKey);

// 3. Tạo invoice phù hợp
if (userId) {
  // Staff user - Invoice có link với user account
  createInvoiceForStaff(sessionId, Number(userId));
} else {
  // Guest - Invoice độc lập
  getInvoiceBySessionId(sessionId);
}
```

### **Session State Management:**

```typescript
// ChargingProcessStaff.tsx
interface Session {
  SessionId: number;
  LicensePlate?: string;
  BatteryPercentage: number;
  StationName: string;
  chargerName: string;
  power: string;
  pricePerKwh: number;
  userType: "staff" | "guest";
}

const [sessions, setSessions] = useState<Session[]>([]);
const [activeSession, setActiveSession] = useState<Session | null>(null);
```

---

## 🔧 Backend API Requirements

### **Endpoints cần có:**

1. ✅ `GET /api/station/getAllStations`
2. ✅ `GET /api/staff/address/stations`
3. ✅ `POST /api/station/getStationinfor`
4. ✅ `GET /api/station/getPoint?stationId=`
5. ✅ `GET /api/station/getPort?pointId=`
6. ✅ `GET /api/vehicle/lookup/company-by-plate?plate=`
7. ✅ `POST /api/charging-session/staff/start`
8. ✅ `POST /api/charging-session/guest/start`
9. ✅ `GET /api/staff/station/sessions`
10. ✅ `GET /api/charging-session/guest/station/:id`
11. ✅ `PUT /api/charging-session/setBatteryPercentage`
12. ✅ `PATCH /api/charging-session/staff/:id/end`
13. ✅ `PATCH /api/charging-session/guest/:id/end`
14. ✅ `POST /api/charging-session/:id/invoice-staff`
15. ✅ `POST /api/charging-session/:id/invoice`
16. ✅ `PATCH /api/payment/:id/pay`

---

## 🚀 Testing Checklist

### **Luồng EV-Driver (có userId):**
- [ ] HomePage → Click "Bắt đầu sạc" → Đến Location
- [ ] Location → Click marker → Đến LocationDetail
- [ ] LocationDetail → Chọn point → Form "EV-Driver"
- [ ] Nhập biển số → Tự động tìm userId
- [ ] Chọn port → Submit → Alert success
- [ ] ✅ **Auto navigate** đến ChargingProcess
- [ ] ChargingProcess → Hiển thị session mới
- [ ] Click "Bắt đầu sạc" → Nhập % pin
- [ ] Quan sát battery % tăng & cost tính toán
- [ ] Click "Dừng sạc" → Alert tạo invoice
- [ ] ✅ **Auto navigate** đến Invoice
- [ ] Invoice → Hiển thị đầy đủ thông tin
- [ ] Click "Thanh toán" → Alert success
- [ ] Check `paid: true`

### **Luồng Guest (không userId):**
- [ ] LocationDetail → Form "Guest"
- [ ] Chọn port → Submit (không cần biển số)
- [ ] ✅ **Auto navigate** đến ChargingProcess
- [ ] Session hiển thị với label "Guest"
- [ ] Kết thúc sạc → Invoice với sessionId
- [ ] Thanh toán thu tiền mặt

### **UI/UX:**
- [ ] Sidebar cố định trên TẤT CẢ trang (không slide)
- [ ] Không có animation opacity hay left position
- [ ] Main content luôn có margin-left: 250px
- [ ] Header không bị đè bởi sidebar
- [ ] Navigation giữa các page mượt mà

---

## 🐛 Known Issues

### **Google Maps API Error:**
- Hiện đang hiển thị: "This page can't load Google Maps correctly"
- **Solution**: Cần enable billing trên Google Cloud Console cho API key
- **Impact**: Map vẫn hiển thị nhưng có overlay lỗi

### **TypeScript Cache:**
- Nếu thấy lỗi "Cannot find module" dù file đã tồn tại
- **Solution**: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

---

## 📝 Notes

- ✅ **Sidebar đã được fix**: Không còn animation slide in/out
- ✅ **Navigation flow hoàn chỉnh**: Auto-navigate sau mỗi action
- ✅ **Data tracking**: userId được lưu trong localStorage
- ✅ **Dual flow support**: EV-Driver và Guest đều hoạt động
- ✅ **Real-time simulation**: Battery & cost update mỗi 2s
- ✅ **Error handling**: Try-catch cho tất cả API calls

---

**📅 Last Updated**: November 12, 2025  
**👨‍💻 Author**: GitHub Copilot  
**🔖 Version**: 1.0 - Staff Workflow Complete
