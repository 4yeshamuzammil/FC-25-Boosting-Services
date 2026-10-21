-- ==============================================================
-- EA Sports FC Boosting Service Platform - SQL Server Database Schema
-- Ready for ASP.NET Core EF Core Migrations or Direct SSMS Execution
-- ==============================================================

USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FCBoostingDb')
BEGIN
    CREATE DATABASE FCBoostingDb;
END
GO

USE FCBoostingDb;
GO

-- 1. Users Table (Identity compatible)
IF OBJECT_ID('dbo.Users', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Users (
        Id NVARCHAR(450) PRIMARY KEY DEFAULT NEWID(),
        UserName NVARCHAR(100) NOT NULL UNIQUE,
        Email NVARCHAR(256) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        DiscordTag NVARCHAR(100) NULL,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME(),
        IsActive BIT DEFAULT 1
    );
END
GO

-- 2. Services Table
IF OBJECT_ID('dbo.Services', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Services (
        Id NVARCHAR(100) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Category NVARCHAR(100) NOT NULL,
        Tagline NVARCHAR(500) NULL,
        BasePrice DECIMAL(18,2) NOT NULL,
        Badge NVARCHAR(50) NULL,
        IsActive BIT DEFAULT 1
    );
END
GO

-- 3. Ranks / Tiers Table
IF OBJECT_ID('dbo.Ranks', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Ranks (
        Id NVARCHAR(100) PRIMARY KEY,
        ServiceId NVARCHAR(100) NOT NULL FOREIGN KEY REFERENCES dbo.Services(Id),
        RankName NVARCHAR(100) NOT NULL,
        RankNumber INT NOT NULL,
        Price DECIMAL(18,2) NOT NULL,
        EstimatedHours NVARCHAR(50) NULL,
        RewardsDescription NVARCHAR(500) NULL
    );
END
GO

-- 4. Addons Table
IF OBJECT_ID('dbo.Addons', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Addons (
        Id NVARCHAR(100) PRIMARY KEY,
        Name NVARCHAR(150) NOT NULL,
        Description NVARCHAR(300) NULL,
        AddonType NVARCHAR(50) NOT NULL, -- 'Percentage' or 'Fixed'
        RateOrAmount DECIMAL(18,2) NOT NULL
    );
END
GO

-- 5. Boosters Table (Verified Pros)
IF OBJECT_ID('dbo.Boosters', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Boosters (
        Id NVARCHAR(450) PRIMARY KEY DEFAULT NEWID(),
        Nickname NVARCHAR(100) NOT NULL,
        RankBadge NVARCHAR(100) NOT NULL,
        Rating DECIMAL(3,2) DEFAULT 5.0,
        CompletedOrders INT DEFAULT 0,
        AssignedPlatform NVARCHAR(50) NOT NULL,
        IsOnline BIT DEFAULT 1
    );
END
GO

-- 6. Orders Table
IF OBJECT_ID('dbo.Orders', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Orders (
        OrderId NVARCHAR(50) PRIMARY KEY,
        UserId NVARCHAR(450) NULL FOREIGN KEY REFERENCES dbo.Users(Id),
        CustomerName NVARCHAR(150) NOT NULL,
        CustomerEmail NVARCHAR(256) NOT NULL,
        GamerTag NVARCHAR(150) NOT NULL,
        Platform NVARCHAR(50) NOT NULL,
        ServiceName NVARCHAR(200) NOT NULL,
        Details NVARCHAR(MAX) NOT NULL,
        TotalPrice DECIMAL(18,2) NOT NULL,
        PaymentStatus NVARCHAR(50) DEFAULT 'Paid',
        PaymentMethod NVARCHAR(50) NOT NULL,
        OrderStatus NVARCHAR(50) DEFAULT 'In Progress', -- 'Pending', 'In Progress', 'Completed', 'Cancelled'
        ProgressPercent INT DEFAULT 0,
        CurrentScore NVARCHAR(150) NULL,
        BoosterId NVARCHAR(450) NULL FOREIGN KEY REFERENCES dbo.Boosters(Id),
        BoosterName NVARCHAR(150) NULL,
        BoosterVpn NVARCHAR(200) NULL,
        OrderDate DATETIME2 DEFAULT SYSUTCDATETIME(),
        CompletedAt DATETIME2 NULL
    );
END
GO

-- 7. Reviews Table
IF OBJECT_ID('dbo.Reviews', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.Reviews (
        Id NVARCHAR(450) PRIMARY KEY DEFAULT NEWID(),
        Author NVARCHAR(100) NOT NULL,
        Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
        Platform NVARCHAR(50) NOT NULL,
        ServiceName NVARCHAR(200) NOT NULL,
        Comment NVARCHAR(MAX) NOT NULL,
        BoosterName NVARCHAR(100) NULL,
        IsVerified BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT SYSUTCDATETIME()
    );
END
GO
