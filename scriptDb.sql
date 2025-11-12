USE master;
Go
--
IF DB_ID('EVCharStation') IS NULL
BEGIN
  CREATE DATABASE EVCharStation;
END;
GO
ALTER DATABASE EVCharStation SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO
DROP DATABASE EVCharStation;

USE master;
GO

USE EVCharStation;
GO
--Bảng Company
CREATE TABLE [Company] (
  [CompanyId] INT IDENTITY(1,1) PRIMARY KEY,
  [CompanyName] NVARCHAR(100),
  [Address] NVARCHAR(100),
  [Mail] NVARCHAR(100),
  [Phone] NVARCHAR(100)
);

-- Bảng User
CREATE TABLE [User] (
  [UserId] INT IDENTITY(1,1) PRIMARY KEY,
  [CompanyId] INT,
  [UserName] NVARCHAR(100),
  [Mail] NVARCHAR(100),
  [PassWord] NVARCHAR(100),
  [RoleName] NVARCHAR(50) CHECK ([RoleName] IN ('ADMIN','STAFF','EVDRIVER', 'BUSINESS')),
  CONSTRAINT [FK_User_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId])
);

-- Bảng Vehicle
CREATE TABLE [Vehicle] (
  [VehicleId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT,
  [CompanyId] INT,
  [VehicleName] NVARCHAR(100),
  [VehicleType] NVARCHAR(100),
  [LicensePlate] NVARCHAR(100),
  [Battery] FLOAT,
  CONSTRAINT [FK_Vehicle_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Vehicle_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId])
);
CREATE INDEX [IX_Vehicle_UserId] ON [Vehicle]([UserId]);
CREATE INDEX [IX_Vehicle_CompanyId] ON [Vehicle]([CompanyId]);
-- Bảng Package
CREATE TABLE [Package] (
  [PackageId] INT IDENTITY(1,1) PRIMARY KEY,
  [PackageName] NVARCHAR(100),
  [PackageDescrip] NVARCHAR(200),
  [PackDeposit] FLOAT DEFAULT 0,    
  [PackagePrice] FLOAT
);

-- Bảng Subcription
CREATE TABLE [Subcription] (
  [SubcriptionId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT NOT NULL,
  [CompanyId] INT NOT NULL,
  [PackageId] INT NOT NULL,
  [StartMonth] NVARCHAR(100),
  [StartDate] DATE,
  [DurationMonth] NVARCHAR(100),
  [DepositAmount] FLOAT DEFAULT 0,     
  [IsDeposited] BIT DEFAULT 0,
  [Status] NVARCHAR(20) DEFAULT 'ACTIVE',     
  CONSTRAINT [FK_Subcription_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Subcription_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId]),
  CONSTRAINT [FK_Subcription_Package] FOREIGN KEY ([PackageId]) REFERENCES [Package]([PackageId]) 
);

-- Bảng Station
CREATE TABLE [Station] (
  [StationId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT,
  [StationName] NVARCHAR(100),
  [Address] NVARCHAR(100),
  [StationStatus] NVARCHAR(20) CHECK ([StationStatus] IN ('ACTIVE','MAINTENANCE','FULL')),
  [StationDescrip] NVARCHAR(200),
  [ChargingPointTotal] INT,
  CONSTRAINT [FK_Station_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
);

-- Bảng ChargingPoint
CREATE TABLE [ChargingPoint] (
  [PointId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationId] INT NOT NULL,
  [ChargingPointStatus] NVARCHAR(20) CHECK ([ChargingPointStatus] IN ('AVAILABLE','BUSY','OFFLINE')),
  [NumberOfPort] INT,
  CONSTRAINT [FK_ChargingPoint_Station] FOREIGN KEY ([StationId]) REFERENCES [Station]([StationId])
);
CREATE INDEX [IX_ChargingPoint_StationId] ON [ChargingPoint]([StationId]);

-- Bảng ChargingPort
CREATE TABLE [ChargingPort] (
  [PortId] INT IDENTITY(1,1) PRIMARY KEY,
  [PointId] INT NOT NULL,
  [PortName] NVARCHAR(100),
  [PortType] NVARCHAR(100),
  [ChargingPortType] NVARCHAR(100),
  [PortTypeOfKwh] FLOAT,
  [PortStatus] NVARCHAR(20) CHECK ([PortStatus] IN ('AVAILABLE','IN_USE','FAULTY')),
  CONSTRAINT [FK_ChargingPort_Point] FOREIGN KEY ([PointId]) REFERENCES [ChargingPoint]([PointId])
);
CREATE INDEX [IX_ChargingPort_PointId] ON [ChargingPort]([PointId]);

-- Bảng Booking 
CREATE TABLE [Booking] (
  [BookingId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationId] INT NOT NULL,
  [PointId] INT NOT NULL,
  [PortId] INT NOT NULL,
  [UserId] INT NOT NULL,
  [VehicleId] INT NOT NULL,
  [BookingDate] DATETIME DEFAULT GETDATE(),
  [StartTime] DATETIME,
  [Status] NVARCHAR(20) CHECK ([Status] IN ('PENDING','ACTIVE','COMPLETED','CANCELLED')),
  [QR] NVARCHAR(100),
  [DepositAmount] FLOAT NULL,
  [DepositStatus] BIT NOT NULL DEFAULT 0,

  CONSTRAINT [FK_Booking_Station] FOREIGN KEY ([StationId]) REFERENCES [Station]([StationId]),
  CONSTRAINT [FK_Booking_Point] FOREIGN KEY ([PointId]) REFERENCES [ChargingPoint]([PointId]),
  CONSTRAINT [FK_Booking_Port] FOREIGN KEY ([PortId]) REFERENCES [ChargingPort]([PortId]),
  CONSTRAINT [FK_Booking_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Booking_Vehicle] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle]([VehicleId])
);



-- Bảng ChargingSession
CREATE TABLE [ChargingSession] (
  [SessionId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationId] INT,
  [BookingId] INT,
  [VehicleId] INT,
  [TotalTime] FLOAT,
  [ChargingStatus] NVARCHAR(20) CHECK ([ChargingStatus] IN ('ONGOING','PAUSED','COMPLETED')),
  [Pause] BIT,
  [SessionPrice] FLOAT,
  [CheckinTime] DATETIME,
  [CheckoutTime] DATETIME,
  [Status] BIT,
  [PenaltyFee] FLOAT,
  [BatteryPercentage] FLOAT,
  CONSTRAINT [FK_Session_Station] FOREIGN KEY ([StationId]) REFERENCES [Station]([StationId]),
  CONSTRAINT [FK_Session_Booking] FOREIGN KEY ([BookingId]) REFERENCES [Booking]([BookingId]),
  CONSTRAINT [FK_Session_Vehicle] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle]([VehicleId])
);

-- Bảng Invoice
CREATE TABLE [Invoice] (
  [InvoiceId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT,
  [CompanyId] INT,
  [MonthYear] NVARCHAR(20),
  [TotalAmount] FLOAT,
  [PaidStatus] NVARCHAR(20) CHECK ([PaidStatus] IN ('Pending','Paid','Overdue')),
  [CreatedAt] DATE,
  CONSTRAINT [FK_Invoice_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Invoice_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId])
);

-- Bảng Payment

CREATE TABLE [Payment] (
  [PaymentId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT NOT NULL,
  [SessionId] INT NULL,
  [InvoiceId] INT NULL,
  [SubcriptionId] INT NULL,
  [BookingId] INT NULL,             
  [TxnRef] NVARCHAR(200) NULL,     
  [TotalAmount] FLOAT DEFAULT 0 NOT NULL,
  [PaymentTime] DATETIME DEFAULT GETDATE(),
  [PaymentStatus] NVARCHAR(20) DEFAULT 'Pending'
      CHECK ([PaymentStatus] IN ('Pending', 'Paid', 'Overdue')),
  [SubPayment] FLOAT DEFAULT 0,       
  [SessionPayment] FLOAT DEFAULT 0,   
  [PaymentType] NVARCHAR(100) NOT NULL, 
  [IsPostPaid] BIT DEFAULT 0,        
  [IsDeposit] BIT DEFAULT 0,        

  CONSTRAINT [FK_Payment_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Payment_Session] FOREIGN KEY ([SessionId]) REFERENCES [ChargingSession]([SessionId]),
  CONSTRAINT [FK_Payment_Subcription] FOREIGN KEY ([SubcriptionId]) REFERENCES [Subcription]([SubcriptionId]),
  CONSTRAINT [FK_Payment_Invoice] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoice]([InvoiceId]),
  CONSTRAINT [FK_Payment_Booking] FOREIGN KEY ([BookingId]) REFERENCES [Booking]([BookingId])
);

-- Indexes để tra cứu nhanh
CREATE INDEX [IX_Payment_BookingId] ON [Payment]([BookingId]);
CREATE UNIQUE INDEX [UX_Payment_TxnRef] ON [Payment]([TxnRef]) WHERE [TxnRef] IS NOT NULL;


-- Bảng RefreshToken
CREATE TABLE [RefreshToken] (
  [RefreshTokenId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT NOT NULL,
  [Token] NVARCHAR(500) NOT NULL,
  [ExpiresAt] DATETIME NOT NULL,
  [Revoked] BIT NOT NULL DEFAULT 0,
  [CreatedAt] DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT [FK_RefreshToken_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
);
CREATE INDEX [IX_RefreshToken_UserId] ON [RefreshToken]([UserId]);



USE EVCharStation;
GO

INSERT INTO [Company] ([CompanyName], [Address], [Mail], [Phone]) VALUES
(N'VinFast EV', N'Hà Nội', N'contact@vinfast.vn', N'0909999001'),
(N'EVN Power', N'Đà Nẵng', N'support@evn.vn', N'0909999002'),
(N'Petrolimex Energy', N'Hồ Chí Minh', N'info@petrolimex.vn', N'0909999003');


INSERT INTO [Vehicle] ([UserId], [CompanyId], [VehicleName], [VehicleType], [LicensePlate], [Battery])
VALUES
(3, 2, N'VF e34', N'Sedan', N'43A-12345', 80.5),
(3, 2, N'VF8', N'SUV', N'43A-67890', 60.0),
(4, 3, N'VF9', N'SUV', N'51H-22222', 75.0);


INSERT INTO [Package] ([PackageName], [PackageDescrip], [PackDeposit], [PackagePrice])
VALUES
(N'Gói Cơ bản', N'Sạc thường 11kW, không giới hạn trạm', 100000, 499000),
(N'Gói Tiêu chuẩn', N'Sạc nhanh 22kW, ưu tiên đặt chỗ', 200000, 999000),
(N'Gói Cao cấp', N'Sạc siêu nhanh 50kW, miễn phí booking', 300000, 1999000);


INSERT INTO [Subcription] ([UserId], [CompanyId], [PackageId], [StartMonth], [StartDate], [DurationMonth], [DepositAmount], [IsDeposited], [Status])
VALUES
(3, 2, 1, N'10/2025', '2025-10-01', N'6', 100000, 1, N'ACTIVE'),
(4, 3, 2, N'10/2025', '2025-10-05', N'12', 200000, 1, N'ACTIVE');


INSERT INTO [Station] ([UserId], [StationName], [Address], [StationStatus], [StationDescrip], [ChargingPointTotal])
VALUES
(4, N'Trạm Sạc VinFast Landmark 81', N'720A Điện Biên Phủ, Bình Thạnh, TP.HCM', N'ACTIVE', N'Sạc nhanh DC 50kW khu trung tâm', 6),
(4, N'Trạm Sạc VinFast Thủ Đức', N'12 Võ Văn Ngân, TP. Thủ Đức, TP.HCM', N'ACTIVE', N'Sạc nhanh và chậm kết hợp', 4),
(4, N'Trạm Sạc EVN Quận 1', N'36 Nguyễn Huệ, Quận 1, TP.HCM', N'ACTIVE', N'Trạm sạc công cộng EVN', 5),
(4, N'Trạm Sạc VinFast Quận 7', N'105 Nguyễn Văn Linh, Quận 7, TP.HCM', N'MAINTENANCE', N'Đang nâng cấp trạm', 3),
(4, N'Trạm Sạc Petrolimex Q5', N'123 Trần Hưng Đạo, Quận 5, TP.HCM', N'ACTIVE', N'Trạm sạc tại cây xăng Petrolimex', 4),
(4, N'Trạm Sạc VinFast Quận 2', N'45 Trần Não, TP. Thủ Đức, TP.HCM', N'ACTIVE', N'Sạc nhanh chuẩn CCS', 5),
(4, N'Trạm Sạc AEON Bình Tân', N'01 Đường Tên Lửa, Bình Tân, TP.HCM', N'FULL', N'Đang phục vụ đủ công suất', 8),
(4, N'Trạm Sạc Lotte Mart Quận 7', N'469 Nguyễn Hữu Thọ, Quận 7, TP.HCM', N'ACTIVE', N'Trạm sạc thương mại trong hầm xe', 4),
(4, N'Trạm Sạc SC VivoCity', N'1058 Nguyễn Văn Linh, Quận 7, TP.HCM', N'ACTIVE', N'Trạm sạc VinFast siêu thị SC VivoCity', 5),
(4, N'Trạm Sạc Vincom Đồng Khởi', N'72 Lê Thánh Tôn, Quận 1, TP.HCM', N'ACTIVE', N'Trạm sạc mini tầng hầm B2', 3),
(4, N'Trạm Sạc VinFast Gò Vấp', N'500 Quang Trung, Gò Vấp, TP.HCM', N'MAINTENANCE', N'Đang kiểm tra cổng sạc', 4),
(4, N'Trạm Sạc Emart Phan Văn Trị', N'366 Phan Văn Trị, Gò Vấp, TP.HCM', N'ACTIVE', N'Trạm sạc công cộng tại trung tâm thương mại', 5),
(4, N'Trạm Sạc VinFast Phú Mỹ Hưng', N'15 Nguyễn Lương Bằng, Quận 7, TP.HCM', N'ACTIVE', N'Sạc nhanh DC 22kW, khu cao cấp', 4),
(4, N'Trạm Sạc Coopmart Cống Quỳnh', N'189C Cống Quỳnh, Quận 1, TP.HCM', N'FULL', N'Công suất tạm thời đầy tải', 2),
(4, N'Trạm Sạc VinFast Quận 3', N'200 Võ Thị Sáu, Quận 3, TP.HCM', N'ACTIVE', N'Sạc nhanh AC/DC', 3),
(4, N'Trạm Sạc Hùng Vương Plaza', N'126 Hùng Vương, Quận 5, TP.HCM', N'ACTIVE', N'Trạm sạc trong hầm B3 trung tâm thương mại', 6),
(4, N'Trạm Sạc Petrolimex Quận 10', N'02 Thành Thái, Quận 10, TP.HCM', N'MAINTENANCE', N'Đang bảo trì định kỳ', 4),
(4, N'Trạm Sạc VinFast Bình Chánh', N'22 Nguyễn Văn Linh, Bình Chánh, TP.HCM', N'ACTIVE', N'Sạc nhanh ven cao tốc', 5),
(4, N'Trạm Sạc VinFast Tân Bình', N'20 Cộng Hòa, Tân Bình, TP.HCM', N'ACTIVE', N'Trạm sạc sân bay', 4),
(4, N'Trạm Sạc VinFast Quận 12', N'90 Lê Văn Khương, Quận 12, TP.HCM', N'ACTIVE', N'Trạm sạc ngoại thành', 3),
(4, N'Trạm Sạc Big C Trường Chinh', N'19 Trường Chinh, Tân Phú, TP.HCM', N'FULL', N'Đang phục vụ tối đa công suất', 6),
(4, N'Trạm Sạc VinFast Bình Thạnh', N'88 Phan Đăng Lưu, Bình Thạnh, TP.HCM', N'ACTIVE', N'Trạm sạc mini nội đô', 4),
(4, N'Trạm Sạc VinFast Quận 8', N'50 Tạ Quang Bửu, Quận 8, TP.HCM', N'MAINTENANCE', N'Đang bảo dưỡng cột sạc', 3),
(4, N'Trạm Sạc VinFast Tân Phú', N'210 Lũy Bán Bích, Tân Phú, TP.HCM', N'ACTIVE', N'Trạm sạc công cộng', 5),
(4, N'Trạm Sạc VinFast Nhà Bè', N'12 Lê Văn Lương, Nhà Bè, TP.HCM', N'ACTIVE', N'Sạc nhanh khu ngoại thành', 4);


-- charging point 

INSERT INTO [ChargingPoint] ([StationId], [ChargingPointStatus], [NumberOfPort]) VALUES
-- Trạm 1: Landmark 81 (6 điểm)
(1, N'AVAILABLE', 4),
(1, N'BUSY', 3),
(1, N'AVAILABLE', 2),
(1, N'OFFLINE', 4),
(1, N'AVAILABLE', 3),
(1, N'BUSY', 5),

-- Trạm 2: Thủ Đức (4 điểm)
(2, N'AVAILABLE', 3),
(2, N'BUSY', 2),
(2, N'AVAILABLE', 4),
(2, N'OFFLINE', 3),

-- Trạm 3: EVN Quận 1 (5 điểm)
(3, N'AVAILABLE', 4),
(3, N'BUSY', 3),
(3, N'AVAILABLE', 2),
(3, N'AVAILABLE', 5),
(3, N'OFFLINE', 3),

-- Trạm 4: VinFast Quận 7 (3 điểm)
(4, N'AVAILABLE', 4),
(4, N'BUSY', 3),
(4, N'OFFLINE', 2),

-- Trạm 5: Petrolimex Q5 (4 điểm)
(5, N'AVAILABLE', 4),
(5, N'BUSY', 3),
(5, N'AVAILABLE', 2),
(5, N'AVAILABLE', 3),

-- Trạm 6: VinFast Quận 2 (5 điểm)
(6, N'AVAILABLE', 3),
(6, N'BUSY', 4),
(6, N'AVAILABLE', 2),
(6, N'OFFLINE', 3),
(6, N'AVAILABLE', 5),

-- Trạm 7: AEON Bình Tân (8 điểm)
(7, N'AVAILABLE', 3),
(7, N'BUSY', 4),
(7, N'AVAILABLE', 2),
(7, N'AVAILABLE', 3),
(7, N'BUSY', 4),
(7, N'AVAILABLE', 3),
(7, N'AVAILABLE', 5),
(7, N'OFFLINE', 2),

-- Trạm 8: Lotte Mart Q7 (4 điểm)
(8, N'AVAILABLE', 3),
(8, N'BUSY', 3),
(8, N'OFFLINE', 2),
(8, N'AVAILABLE', 4),

-- Trạm 9: SC VivoCity (5 điểm)
(9, N'AVAILABLE', 3),
(9, N'AVAILABLE', 2),
(9, N'BUSY', 4),
(9, N'AVAILABLE', 3),
(9, N'OFFLINE', 2),

-- Trạm 10: Vincom Đồng Khởi (3 điểm)
(10, N'AVAILABLE', 3),
(10, N'BUSY', 2),
(10, N'AVAILABLE', 4),

-- Trạm 11: VinFast Gò Vấp (4 điểm)
(11, N'AVAILABLE', 3),
(11, N'BUSY', 3),
(11, N'AVAILABLE', 2),
(11, N'OFFLINE', 4),

-- Trạm 12: Emart Phan Văn Trị (5 điểm)
(12, N'AVAILABLE', 3),
(12, N'BUSY', 2),
(12, N'AVAILABLE', 4),
(12, N'AVAILABLE', 3),
(12, N'OFFLINE', 2),

-- Trạm 13: VinFast Phú Mỹ Hưng (4 điểm)
(13, N'AVAILABLE', 3),
(13, N'BUSY', 2),
(13, N'AVAILABLE', 4),
(13, N'AVAILABLE', 3),

-- Trạm 14: Coopmart Cống Quỳnh (2 điểm)
(14, N'AVAILABLE', 2),
(14, N'BUSY', 3),

-- Trạm 15: VinFast Quận 3 (3 điểm)
(15, N'AVAILABLE', 3),
(15, N'BUSY', 2),
(15, N'AVAILABLE', 4),

-- Trạm 16: Hùng Vương Plaza (6 điểm)
(16, N'AVAILABLE', 4),
(16, N'BUSY', 3),
(16, N'AVAILABLE', 2),
(16, N'AVAILABLE', 3),
(16, N'BUSY', 3),
(16, N'AVAILABLE', 4),

-- Trạm 17: Petrolimex Q10 (4 điểm)
(17, N'AVAILABLE', 3),
(17, N'BUSY', 2),
(17, N'AVAILABLE', 4),
(17, N'OFFLINE', 3),

-- Trạm 18: VinFast Bình Chánh (5 điểm)
(18, N'AVAILABLE', 3),
(18, N'BUSY', 3),
(18, N'AVAILABLE', 4),
(18, N'AVAILABLE', 2),
(18, N'OFFLINE', 3),

-- Trạm 19: VinFast Tân Bình (4 điểm)
(19, N'AVAILABLE', 4),
(19, N'BUSY', 2),
(19, N'AVAILABLE', 3),
(19, N'AVAILABLE', 3),

-- Trạm 20: VinFast Quận 12 (3 điểm)
(20, N'AVAILABLE', 2),
(20, N'BUSY', 3),
(20, N'AVAILABLE', 3),

-- Trạm 21: Big C Trường Chinh (6 điểm)
(21, N'AVAILABLE', 3),
(21, N'BUSY', 3),
(21, N'AVAILABLE', 2),
(21, N'AVAILABLE', 4),
(21, N'BUSY', 3),
(21, N'AVAILABLE', 5),

-- Trạm 22: VinFast Bình Thạnh (4 điểm)
(22, N'AVAILABLE', 3),
(22, N'BUSY', 2),
(22, N'AVAILABLE', 3),
(22, N'OFFLINE', 4),

-- Trạm 23: VinFast Quận 8 (3 điểm)
(23, N'AVAILABLE', 2),
(23, N'BUSY', 3),
(23, N'AVAILABLE', 3),

-- Trạm 24: VinFast Tân Phú (5 điểm)
(24, N'AVAILABLE', 3),
(24, N'BUSY', 2),
(24, N'AVAILABLE', 4),
(24, N'AVAILABLE', 3),
(24, N'OFFLINE', 2),

-- Trạm 25: VinFast Nhà Bè (4 điểm)
(25, N'AVAILABLE', 3),
(25, N'BUSY', 3),
(25, N'AVAILABLE', 2),
(25, N'AVAILABLE', 4);


-- port

INSERT INTO [ChargingPort] 
([PointId], [PortName], [PortType], [ChargingPortType], [PortTypeOfKwh], [PortStatus]) 
VALUES

-- Point 2
(2, N'Port B1', N'Type2', N'AC', 7.4, N'AVAILABLE'),
(2, N'Port B2', N'CCS', N'DC', 50.0, N'AVAILABLE'),

-- Point 3
(3, N'Port C1', N'CHAdeMO', N'DC', 50.0, N'AVAILABLE'),
(3, N'Port C2', N'CCS', N'DC', 22.0, N'IN_USE'),

-- Point 4
(4, N'Port D1', N'Type2', N'AC', 11.0, N'AVAILABLE'),
(4, N'Port D2', N'Type2', N'AC', 11.0, N'FAULTY'),

-- Point 5
(5, N'Port E1', N'Type2', N'AC', 7.4, N'AVAILABLE'),
(5, N'Port E2', N'CCS', N'DC', 22.0, N'IN_USE'),

-- Point 6
(6, N'Port F1', N'Type2', N'AC', 11.0, N'AVAILABLE'),
(6, N'Port F2', N'CCS', N'DC', 50.0, N'AVAILABLE'),

-- Point 7
(7, N'Port G1', N'CCS', N'DC', 22.0, N'AVAILABLE'),
(7, N'Port G2', N'Type2', N'AC', 7.4, N'IN_USE'),

-- Point 8
(8, N'Port H1', N'CHAdeMO', N'DC', 50.0, N'AVAILABLE'),
(8, N'Port H2', N'Type2', N'AC', 11.0, N'AVAILABLE'),

-- Point 9
(9, N'Port I1', N'Type2', N'AC', 11.0, N'AVAILABLE'),
(9, N'Port I2', N'CCS', N'DC', 22.0, N'FAULTY'),

-- Point 10
(10, N'Port J1', N'Type2', N'AC', 7.4, N'AVAILABLE'),
(10, N'Port J2', N'CCS', N'DC', 22.0, N'AVAILABLE');
