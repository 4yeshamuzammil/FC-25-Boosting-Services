IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [OrderSessionTokens] (
        [Token] nvarchar(100) NOT NULL,
        [OrderReference] nvarchar(50) NOT NULL,
        [ServiceId] nvarchar(100) NOT NULL,
        [ServiceName] nvarchar(200) NOT NULL,
        [PriceSnapshot] decimal(18,2) NOT NULL,
        [Platform] nvarchar(50) NOT NULL,
        [TargetChannel] nvarchar(50) NOT NULL,
        [ExpiresAt] datetime2 NOT NULL,
        [IsUsed] bit NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_OrderSessionTokens] PRIMARY KEY ([Token])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [Services] (
        [ServiceId] nvarchar(100) NOT NULL,
        [Name] nvarchar(200) NOT NULL,
        [Description] nvarchar(1000) NOT NULL,
        [Price] decimal(18,2) NOT NULL,
        [IsActive] bit NOT NULL,
        [ServiceRequirements] nvarchar(2000) NOT NULL,
        CONSTRAINT [PK_Services] PRIMARY KEY ([ServiceId])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [Users] (
        [UserId] nvarchar(450) NOT NULL,
        [DisplayName] nvarchar(100) NOT NULL,
        [Email] nvarchar(256) NOT NULL,
        [GoogleSubjectId] nvarchar(256) NULL,
        [DiscordUserId] nvarchar(256) NULL,
        [DiscordTag] nvarchar(100) NULL,
        [Role] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [ExternalAccounts] (
        [ExternalAccountId] nvarchar(450) NOT NULL,
        [UserId] nvarchar(450) NOT NULL,
        [Provider] nvarchar(50) NOT NULL,
        [ProviderSubjectId] nvarchar(256) NOT NULL,
        [LinkedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_ExternalAccounts] PRIMARY KEY ([ExternalAccountId]),
        CONSTRAINT [FK_ExternalAccounts_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [Orders] (
        [OrderId] nvarchar(450) NOT NULL,
        [OrderNumber] nvarchar(50) NOT NULL,
        [UserId] nvarchar(450) NULL,
        [ServiceId] nvarchar(100) NOT NULL,
        [ServiceName] nvarchar(200) NOT NULL,
        [ContactMethod] nvarchar(50) NOT NULL,
        [Status] nvarchar(50) NOT NULL,
        [PriceSnapshot] decimal(18,2) NOT NULL,
        [Platform] nvarchar(50) NOT NULL,
        [CustomerName] nvarchar(100) NULL,
        [CustomerEmail] nvarchar(256) NULL,
        [GamerTag] nvarchar(100) NULL,
        [DiscordUserId] nvarchar(50) NULL,
        [DiscordGuildId] nvarchar(50) NULL,
        [DiscordChannelId] nvarchar(50) NULL,
        [DiscordMessageId] nvarchar(50) NULL,
        [WhatsAppReference] nvarchar(100) NULL,
        [CreatedAt] datetime2 NOT NULL,
        [UpdatedAt] datetime2 NOT NULL,
        [CompletedAt] datetime2 NULL,
        CONSTRAINT [PK_Orders] PRIMARY KEY ([OrderId]),
        CONSTRAINT [FK_Orders_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId])
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [OrderAttachments] (
        [AttachmentId] nvarchar(450) NOT NULL,
        [OrderId] nvarchar(450) NOT NULL,
        [FileName] nvarchar(256) NOT NULL,
        [StorageKey] nvarchar(500) NOT NULL,
        [ContentType] nvarchar(100) NOT NULL,
        [FileSize] bigint NOT NULL,
        [UploadedByUserId] nvarchar(450) NOT NULL,
        [UploadedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_OrderAttachments] PRIMARY KEY ([AttachmentId]),
        CONSTRAINT [FK_OrderAttachments_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([OrderId]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [OrderDetails] (
        [OrderDetailId] nvarchar(450) NOT NULL,
        [OrderId] nvarchar(450) NOT NULL,
        [FieldName] nvarchar(100) NOT NULL,
        [FieldValue] nvarchar(2000) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_OrderDetails] PRIMARY KEY ([OrderDetailId]),
        CONSTRAINT [FK_OrderDetails_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([OrderId]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE TABLE [OrderStatusHistory] (
        [HistoryId] nvarchar(450) NOT NULL,
        [OrderId] nvarchar(450) NOT NULL,
        [PreviousStatus] nvarchar(50) NOT NULL,
        [NewStatus] nvarchar(50) NOT NULL,
        [ChangedByUserId] nvarchar(450) NULL,
        [ChangedAt] datetime2 NOT NULL,
        [Notes] nvarchar(1000) NOT NULL,
        CONSTRAINT [PK_OrderStatusHistory] PRIMARY KEY ([HistoryId]),
        CONSTRAINT [FK_OrderStatusHistory_Orders_OrderId] FOREIGN KEY ([OrderId]) REFERENCES [Orders] ([OrderId]) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE UNIQUE INDEX [IX_ExternalAccounts_Provider_ProviderSubjectId] ON [ExternalAccounts] ([Provider], [ProviderSubjectId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_ExternalAccounts_UserId] ON [ExternalAccounts] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_OrderAttachments_OrderId] ON [OrderAttachments] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_OrderDetails_OrderId] ON [OrderDetails] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_Orders_CreatedAt] ON [Orders] ([CreatedAt]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Orders_OrderNumber] ON [Orders] ([OrderNumber]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_Orders_Status] ON [Orders] ([Status]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_Orders_UserId] ON [Orders] ([UserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_Orders_WhatsAppReference] ON [Orders] ([WhatsAppReference]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_OrderStatusHistory_OrderId] ON [OrderStatusHistory] ([OrderId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_Users_DiscordUserId] ON [Users] ([DiscordUserId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    CREATE INDEX [IX_Users_GoogleSubjectId] ON [Users] ([GoogleSubjectId]);
END;

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20261021172837_InitialFCSchema'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20261021172837_InitialFCSchema', N'10.0.13');
END;

COMMIT;
GO

