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
  CONSTRAINT [FK_Subcription_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Subcription_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId]),
  CONSTRAINT [FK_Subcription_Package] FOREIGN KEY ([PackageId]) REFERENCES [Package]([PackageId]) -- ✅ liên kết tới Package
);


-- Bảng Station
CREATE TABLE [Station] (
  [StationId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationName] NVARCHAR(100),
  [Address] NVARCHAR(100),
  [StationStatus] NVARCHAR(20) CHECK ([StationStatus] IN ('ACTIVE','MAINTENANCE','FULL')),
  [StationDescrip] NVARCHAR(200),
  [ChargingPointTotal] INT
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
  [StationId] INT,
  [UserId] INT,
  [VehicleId] INT,
  [BookingDate] DATE,
  [Status] NVARCHAR(20) CHECK ([Status] IN ('ACTIVE','MAINTENANCE','FULL')),
  [QR] NVARCHAR(100),
  [DepositStatus] BIT,
  CONSTRAINT [FK_Booking_Station] FOREIGN KEY ([StationId]) REFERENCES [Station]([StationId]),
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
  [UserId] INT,
  [SessionId] INT,
  [InvoiceId] INT,
  [TotalAmount] FLOAT,
  [PaymentTime] DATE,
  [PaymentStatus] NVARCHAR(20) CHECK ([PaymentStatus] IN ('Pending','Paid','Overdue')),
  [SubPayment] FLOAT,
  [SessionPayment] FLOAT,
  [PaymentType] NVARCHAR(100),
  [IsPostPaid] BIT,
  CONSTRAINT [FK_Payment_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Payment_Session] FOREIGN KEY ([SessionId]) REFERENCES [ChargingSession]([SessionId]),
  CONSTRAINT [FK_Payment_Invoice] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoice]([InvoiceId])
);

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
