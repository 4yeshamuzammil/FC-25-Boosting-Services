-- ==============================================================
-- Game Service Platform - Complete Database Setup Script
-- Tables: Users, Orders, PlayerApplications, PlayerEarnings, AgreementAcceptances, AuditLogs
-- Stored Procedures: sp_ClaimOrder, sp_GetAdminDashboardStats
-- ==============================================================

USE master;
GO

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'GameServiceDb')
BEGIN
    CREATE DATABASE [GameServiceDb];
END
GO

USE [GameServiceDb];
GO

-- 1. Users Table
IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(150) NOT NULL,
        Email NVARCHAR(256) NOT NULL UNIQUE,
        Phone NVARCHAR(50) NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Category CHAR(1) NOT NULL, -- 'A' = Admin, 'C' = Customer, 'P' = Player
        Status NVARCHAR(50) NOT NULL DEFAULT 'Active', -- 'Active', 'Pending', 'Approved', 'Rejected', 'Suspended'
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT CK_Users_Category CHECK (Category IN ('A', 'C', 'P'))
    );

    CREATE NONCLUSTERED INDEX IX_Users_Category ON dbo.Users(Category);
    CREATE NONCLUSTERED INDEX IX_Users_Email ON dbo.Users(Email);
END
GO

-- 2. Orders Table
IF OBJECT_ID(N'dbo.Orders', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CustomerId INT NOT NULL,
        GameName NVARCHAR(100) NOT NULL,
        ServiceType NVARCHAR(100) NOT NULL,
        TargetRank NVARCHAR(100) NOT NULL,
        Details NVARCHAR(MAX) NULL,
        Amount DECIMAL(18,2) NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Open', -- 'Open', 'Assigned', 'InProgress', 'Completed', 'Cancelled'
        AssignedPlayerId INT NULL,
        AssignedAt DATETIME2 NULL,
        CompletedAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_Orders_Customer FOREIGN KEY (CustomerId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_Orders_AssignedPlayer FOREIGN KEY (AssignedPlayerId) REFERENCES dbo.Users(Id),
        CONSTRAINT CK_Orders_Status CHECK (Status IN ('Open', 'Assigned', 'InProgress', 'Completed', 'Cancelled'))
    );

    CREATE NONCLUSTERED INDEX IX_Orders_Status ON dbo.Orders(Status);
    CREATE NONCLUSTERED INDEX IX_Orders_AssignedPlayerId ON dbo.Orders(AssignedPlayerId);
    CREATE NONCLUSTERED INDEX IX_Orders_CustomerId ON dbo.Orders(CustomerId);
END
GO

-- 3. PlayerApplications Table
IF OBJECT_ID(N'dbo.PlayerApplications', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlayerApplications (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        DateOfBirth DATE NOT NULL,
        IsAdult BIT NOT NULL DEFAULT 1,
        CnicNumber NVARCHAR(50) NULL,
        DocumentPaths NVARCHAR(MAX) NULL,
        ScreenshotPaths NVARCHAR(MAX) NULL,
        ApplicationStatus NVARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
        AdminRemarks NVARCHAR(MAX) NULL,
        ReviewedAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_PlayerApplications_User FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
        CONSTRAINT CK_PlayerApplications_Status CHECK (ApplicationStatus IN ('Pending', 'Approved', 'Rejected'))
    );

    CREATE NONCLUSTERED INDEX IX_PlayerApplications_UserId ON dbo.PlayerApplications(UserId);
    CREATE NONCLUSTERED INDEX IX_PlayerApplications_Status ON dbo.PlayerApplications(ApplicationStatus);
END
GO

-- 4. PlayerEarnings Table
IF OBJECT_ID(N'dbo.PlayerEarnings', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.PlayerEarnings (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        PlayerId INT NOT NULL,
        OrderId INT NOT NULL,
        Amount DECIMAL(18,2) NOT NULL,
        PaidStatus NVARCHAR(50) NOT NULL DEFAULT 'Unpaid', -- 'Unpaid', 'Paid'
        PaidAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_PlayerEarnings_Player FOREIGN KEY (PlayerId) REFERENCES dbo.Users(Id),
        CONSTRAINT FK_PlayerEarnings_Order FOREIGN KEY (OrderId) REFERENCES dbo.Orders(Id),
        CONSTRAINT CK_PlayerEarnings_PaidStatus CHECK (PaidStatus IN ('Unpaid', 'Paid'))
    );

    CREATE NONCLUSTERED INDEX IX_PlayerEarnings_PlayerId ON dbo.PlayerEarnings(PlayerId);
    CREATE NONCLUSTERED INDEX IX_PlayerEarnings_OrderId ON dbo.PlayerEarnings(OrderId);
    CREATE NONCLUSTERED INDEX IX_PlayerEarnings_PaidStatus ON dbo.PlayerEarnings(PaidStatus);
END
GO

-- 5. AgreementAcceptances Table
IF OBJECT_ID(N'dbo.AgreementAcceptances', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AgreementAcceptances (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        AgreementVersion NVARCHAR(50) NOT NULL DEFAULT 'v1.0',
        AcceptedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        IpAddress NVARCHAR(50) NULL,
        CONSTRAINT FK_AgreementAcceptances_User FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
    );

    CREATE NONCLUSTERED INDEX IX_AgreementAcceptances_UserId ON dbo.AgreementAcceptances(UserId);
END
GO

-- 6. AuditLogs Table
IF OBJECT_ID(N'dbo.AuditLogs', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.AuditLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        AdminUserId INT NOT NULL,
        Action NVARCHAR(100) NOT NULL,
        TargetEntity NVARCHAR(100) NOT NULL,
        TargetId INT NOT NULL,
        Details NVARCHAR(MAX) NULL,
        Timestamp DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
        IpAddress NVARCHAR(50) NULL,
        CONSTRAINT FK_AuditLogs_Admin FOREIGN KEY (AdminUserId) REFERENCES dbo.Users(Id)
    );

    CREATE NONCLUSTERED INDEX IX_AuditLogs_Timestamp ON dbo.AuditLogs(Timestamp);
    CREATE NONCLUSTERED INDEX IX_AuditLogs_AdminUserId ON dbo.AuditLogs(AdminUserId);
END
GO

-- 7. Stored Procedure: sp_ClaimOrder (Atomic Claim)
CREATE OR ALTER PROCEDURE dbo.sp_ClaimOrder
    @OrderId INT,
    @PlayerId INT,
    @Success BIT OUTPUT,
    @Message NVARCHAR(250) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;
    BEGIN TRY
        -- Verify player status is Approved
        IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Id = @PlayerId AND Category = 'P' AND Status = 'Approved')
        BEGIN
            SET @Success = 0;
            SET @Message = 'Only approved players can claim orders.';
            ROLLBACK TRANSACTION;
            RETURN;
        END

        -- Atomic update with strict concurrency protection
        UPDATE dbo.Orders
        SET AssignedPlayerId = @PlayerId,
            Status = 'Assigned',
            AssignedAt = SYSUTCDATETIME()
        WHERE Id = @OrderId 
          AND AssignedPlayerId IS NULL 
          AND Status = 'Open';

        IF @@ROWCOUNT = 1
        BEGIN
            DECLARE @OrderAmount DECIMAL(18,2);
            SELECT @OrderAmount = Amount FROM dbo.Orders WHERE Id = @OrderId;

            -- Player payout rate: default 70% of order price
            DECLARE @PlayerPayout DECIMAL(18,2) = ROUND(@OrderAmount * 0.70, 2);

            INSERT INTO dbo.PlayerEarnings (PlayerId, OrderId, Amount, PaidStatus, CreatedAt)
            VALUES (@PlayerId, @OrderId, @PlayerPayout, 'Unpaid', SYSUTCDATETIME());

            COMMIT TRANSACTION;
            SET @Success = 1;
            SET @Message = 'Order claimed successfully.';
        END
        ELSE
        BEGIN
            ROLLBACK TRANSACTION;
            SET @Success = 0;
            SET @Message = 'Order already taken or no longer available.';
        END
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        SET @Success = 0;
        SET @Message = ERROR_MESSAGE();
    END CATCH
END
GO

-- 8. Stored Procedure: sp_GetAdminDashboardStats
CREATE OR ALTER PROCEDURE dbo.sp_GetAdminDashboardStats
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @FirstDayOfMonth DATETIME2 = DATEFROMPARTS(YEAR(SYSUTCDATETIME()), MONTH(SYSUTCDATETIME()), 1);

    SELECT 
        (SELECT COUNT(*) FROM dbo.Orders) AS TotalOrdersReceived,
        (SELECT COUNT(*) FROM dbo.Orders WHERE CreatedAt >= @FirstDayOfMonth) AS OrdersThisMonth,
        (SELECT ISNULL(SUM(Amount), 0) FROM dbo.Orders WHERE CreatedAt >= @FirstDayOfMonth) AS TotalAmountThisMonth,
        (SELECT ISNULL(SUM(Amount), 0) FROM dbo.Orders) AS AllTimeAmount,
        (SELECT COUNT(*) FROM dbo.Users WHERE Category = 'C') AS TotalCustomers,
        (SELECT COUNT(*) FROM dbo.Users WHERE Category = 'P' AND Status = 'Approved') AS TotalApprovedPlayers,
        (SELECT COUNT(*) FROM dbo.PlayerApplications WHERE ApplicationStatus = 'Pending') AS PendingPlayerApplications;

    -- Orders by Status breakdown
    SELECT Status, COUNT(*) AS OrderCount
    FROM dbo.Orders
    GROUP BY Status;
END
GO

-- 9. Seed Initial Admin Account
-- Default credentials: admin@gameboost.com / Admin123!
-- PasswordHash generated with BCrypt work factor 11 for "Admin123!"
IF NOT EXISTS (SELECT 1 FROM dbo.Users WHERE Email = 'admin@gameboost.com')
BEGIN
    INSERT INTO dbo.Users (FullName, Email, Phone, PasswordHash, Category, Status, CreatedAt)
    VALUES (
        N'System Administrator',
        N'admin@gameboost.com',
        N'+1-555-0100',
        N'$2a$11$w8aKx9sV6r7EfZ/5k6X4.O7yB6W6Y5Q5X0qU5m8a1Y2K3p4N5O6Pe', -- Will also be validated/re-hashed or seeded via EF
        'A',
        N'Approved',
        SYSUTCDATETIME()
    );
END
GO
