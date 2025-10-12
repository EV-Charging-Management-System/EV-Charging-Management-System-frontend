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
-- BẢNG Role
CREATE TABLE [Role] (
  [RoleId] INT IDENTITY(1,1) PRIMARY KEY,
  [RoleName] VARCHAR(100)
);


-- BẢNG Company
CREATE TABLE [Company] (
  [CompanyId] INT IDENTITY(1,1) PRIMARY KEY,
  [CompanyName] VARCHAR(100),
  [Address] VARCHAR(100),
  [Mail] VARCHAR(100),
  [Phone] VARCHAR(100)
);

-- BẢNG User
CREATE TABLE [User] (
  [UserId] INT IDENTITY(1,1) PRIMARY KEY,
  [CompanyId] INT,
  [UserName] VARCHAR(100),
  [Mail] VARCHAR(100),
  [PassWord] VARCHAR(100),
  [RoleId] INT,
  CONSTRAINT [FK_User_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId]),
  CONSTRAINT [FK_User_Role] FOREIGN KEY ([RoleId]) REFERENCES [Role]([RoleId])
);
CREATE TABLE RefreshToken (
  RefreshTokenId INT IDENTITY(1,1) PRIMARY KEY,
  UserId INT NOT NULL,
  Token NVARCHAR(500) NOT NULL,
  ExpiresAt DATETIME NOT NULL,
  Revoked BIT NOT NULL DEFAULT 0,
  CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
  CONSTRAINT FK_RefreshToken_User FOREIGN KEY (UserId) REFERENCES [User](UserId)
);
-- BẢNG Vehicle
CREATE TABLE [Vehicle] (
  [VehicleId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT,
  [CompanyId] INT,
  [VehicleName] VARCHAR(100),
  [LicensePlate] VARCHAR(100),
  [Battery] FLOAT,
  CONSTRAINT [FK_Vehicle_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Vehicle_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId])
);
CREATE INDEX [IX_Vehicle_UserId] ON [Vehicle]([UserId]);
CREATE INDEX [IX_Vehicle_CompanyId] ON [Vehicle]([CompanyId]);

-- BẢNG Address
CREATE TABLE [Address] (
  [StationId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationName] VARCHAR(100),
  [StationAddress] VARCHAR(100),
  [StationStatus] VARCHAR(30) CHECK ([StationStatus] IN ('ACTIVE', 'MAINTENANCE', 'FULL')),
  [TotalSlots] INT,
  [TypeofKwh] FLOAT,
  [StationDescrip] VARCHAR(100)
);

-- BẢNG Booking
CREATE TABLE [Booking] (
  [BookingId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationId] INT,
  [UserId] INT,
  [VehicleId] INT,
  [BookingDate] DATE,
  [BookingStatus] VARCHAR(20) CHECK ([BookingStatus] IN ('ACTIVE', 'MAINTENANCE', 'FULL')),
  [QR] VARCHAR(100),
  [DepositStatus] BIT,
  CONSTRAINT [FK_Booking_Station] FOREIGN KEY ([StationId]) REFERENCES [Address]([StationId]),
  CONSTRAINT [FK_Booking_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Booking_Vehicle] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicle]([VehicleId])
);

-- BẢNG ChargingSession
CREATE TABLE [ChargingSession] (
  [SessionId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationId] INT,
  [BookingId] INT,
  [TotalTime] FLOAT,
  [ChargingStatus] VARCHAR(20) CHECK ([ChargingStatus] IN ('NOTFULL', 'FULL')),
  [Pause] BIT,
  [SessionPrice] FLOAT,
  CONSTRAINT [FK_ChargingSession_Booking] FOREIGN KEY ([BookingId]) REFERENCES [Booking]([BookingId]),
  CONSTRAINT [FK_ChargingSession_Station] FOREIGN KEY ([StationId]) REFERENCES [Address]([StationId])
);

-- BẢNG SessionLog
CREATE TABLE [SessionLog] (
  [SessionLogId] INT IDENTITY(1,1) PRIMARY KEY,
  [StationId] INT,
  [SessionId] INT,
  [BookingId] INT,
  [CheckINTime] DATE,
  [CheckoutTime] DATE,
  [Status] BIT,
  CONSTRAINT [FK_SessionLog_Session] FOREIGN KEY ([SessionId]) REFERENCES [ChargingSession]([SessionId]),
  CONSTRAINT [FK_SessionLog_Booking] FOREIGN KEY ([BookingId]) REFERENCES [Booking]([BookingId]),
  CONSTRAINT [FK_SessionLog_Station] FOREIGN KEY ([StationId]) REFERENCES [Address]([StationId])
);


-- BẢNG Service
CREATE TABLE [Service] (
  [ServiceId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT,
  [ServiceName] VARCHAR(100),
  [Type] VARCHAR(100),
  [SubDiscrip] VARCHAR(100),
  [ServicePrice] FLOAT,
  [DurationMonth] VARCHAR(100),
  [StartDate] DATE,
  [EndDate] DATE,
  CONSTRAINT [FK_Service_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
);

-- BẢNG Statement
CREATE TABLE [Statement] (
  [StatementId] INT IDENTITY(1,1) PRIMARY KEY,
  [UserId] INT,
  [CompanyId] INT,
  [MonthYear] INT,
  [TotalAmount] FLOAT,
  [PaidStatus] VARCHAR(20) CHECK ([PaidStatus] IN ('Pending', 'Paid', 'Overdue')),
  [CreatedAt] DATE,
  CONSTRAINT [FK_Statement_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId]),
  CONSTRAINT [FK_Statement_Company] FOREIGN KEY ([CompanyId]) REFERENCES [Company]([CompanyId])
);

-- BẢNG Payment
CREATE TABLE [Payment] (
  [PaymentId] INT IDENTITY(1,1) PRIMARY KEY,
  [ServiceId] INT,
  [SessionId] INT,
  [StatementId] INT,
  [TotalAmount] FLOAT,
  [PaymentTime] DATE,
  [PaymentStatus] VARCHAR(20) CHECK ([PaymentStatus] IN ('Pending', 'Paid', 'Overdue')),
  [SubPayment] FLOAT,
  [SessionPayment] FLOAT,

  [IsPostPaid] BIT,
  CONSTRAINT [FK_Payment_Service] FOREIGN KEY ([ServiceId]) REFERENCES [Service]([ServiceId]),
  CONSTRAINT [FK_Payment_Session] FOREIGN KEY ([SessionId]) REFERENCES [ChargingSession]([SessionId]),
  CONSTRAINT [FK_Payment_Statement] FOREIGN KEY ([StatementId]) REFERENCES [Statement]([StatementId])
);

-- BẢNG Penalty
CREATE TABLE [Penalty] (
  [PenaltyId] INT IDENTITY(1,1) PRIMARY KEY,
  [SessionId] INT,
  [UserId] INT,
  [Reason] VARCHAR(100),	
  [PenaltyFee] FLOAT,
  [PenaltyStatus] VARCHAR(20) CHECK ([PenaltyStatus] IN ('Pending', 'Paid', 'Overdue')),
  [CreatedAt] DATE,
  CONSTRAINT [FK_Penalty_Session] FOREIGN KEY ([SessionId]) REFERENCES [ChargingSession]([SessionId]),
  CONSTRAINT [FK_Penalty_User] FOREIGN KEY ([UserId]) REFERENCES [User]([UserId])
);
