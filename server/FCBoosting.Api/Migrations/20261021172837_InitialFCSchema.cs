using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FCBoosting.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialFCSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OrderSessionTokens",
                columns: table => new
                {
                    Token = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    OrderReference = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ServiceId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ServiceName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PriceSnapshot = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Platform = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TargetChannel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsUsed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderSessionTokens", x => x.Token);
                });

            migrationBuilder.CreateTable(
                name: "Services",
                columns: table => new
                {
                    ServiceId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    ServiceRequirements = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Services", x => x.ServiceId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    GoogleSubjectId = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    DiscordUserId = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    DiscordTag = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "ExternalAccounts",
                columns: table => new
                {
                    ExternalAccountId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    Provider = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ProviderSubjectId = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    LinkedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExternalAccounts", x => x.ExternalAccountId);
                    table.ForeignKey(
                        name: "FK_ExternalAccounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    OrderId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    OrderNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    ServiceId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ServiceName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ContactMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PriceSnapshot = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Platform = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    CustomerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CustomerEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    GamerTag = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DiscordUserId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DiscordGuildId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DiscordChannelId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    DiscordMessageId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    WhatsAppReference = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.OrderId);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "OrderAttachments",
                columns: table => new
                {
                    AttachmentId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    StorageKey = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ContentType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    UploadedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderAttachments", x => x.AttachmentId);
                    table.ForeignKey(
                        name: "FK_OrderAttachments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    OrderDetailId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    FieldName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    FieldValue = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => x.OrderDetailId);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderStatusHistory",
                columns: table => new
                {
                    HistoryId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    OrderId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    PreviousStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NewStatus = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ChangedByUserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    ChangedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderStatusHistory", x => x.HistoryId);
                    table.ForeignKey(
                        name: "FK_OrderStatusHistory_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "OrderId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExternalAccounts_Provider_ProviderSubjectId",
                table: "ExternalAccounts",
                columns: new[] { "Provider", "ProviderSubjectId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ExternalAccounts_UserId",
                table: "ExternalAccounts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderAttachments_OrderId",
                table: "OrderAttachments",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderId",
                table: "OrderDetails",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_CreatedAt",
                table: "Orders",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Status",
                table: "Orders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_WhatsAppReference",
                table: "Orders",
                column: "WhatsAppReference");

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatusHistory_OrderId",
                table: "OrderStatusHistory",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_DiscordUserId",
                table: "Users",
                column: "DiscordUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_GoogleSubjectId",
                table: "Users",
                column: "GoogleSubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExternalAccounts");

            migrationBuilder.DropTable(
                name: "OrderAttachments");

            migrationBuilder.DropTable(
                name: "OrderDetails");

            migrationBuilder.DropTable(
                name: "OrderSessionTokens");

            migrationBuilder.DropTable(
                name: "OrderStatusHistory");

            migrationBuilder.DropTable(
                name: "Services");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
