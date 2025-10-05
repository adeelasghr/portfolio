using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class NewInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFinances_ContractItem_ContractItemID",
                table: "ContractFinances");

            migrationBuilder.DropTable(
                name: "ContractItem");

            migrationBuilder.RenameColumn(
                name: "ContractItemID",
                table: "ContractFinances",
                newName: "FinanceItemID");

            migrationBuilder.RenameIndex(
                name: "IX_ContractFinances_ContractItemID",
                table: "ContractFinances",
                newName: "IX_ContractFinances_FinanceItemID");

            migrationBuilder.AddColumn<decimal>(
                name: "Discount",
                table: "Invoices",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "InvoiceItems",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "FinanceItemID",
                table: "InvoiceItems",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "InvoiceItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "InvoiceItems",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_InvoiceItems_FinanceItemID",
                table: "InvoiceItems",
                column: "FinanceItemID");

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFinances_FinanceItems_FinanceItemID",
                table: "ContractFinances",
                column: "FinanceItemID",
                principalTable: "FinanceItems",
                principalColumn: "FinanceItemID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InvoiceItems_FinanceItems_FinanceItemID",
                table: "InvoiceItems",
                column: "FinanceItemID",
                principalTable: "FinanceItems",
                principalColumn: "FinanceItemID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ContractFinances_FinanceItems_FinanceItemID",
                table: "ContractFinances");

            migrationBuilder.DropForeignKey(
                name: "FK_InvoiceItems_FinanceItems_FinanceItemID",
                table: "InvoiceItems");

            migrationBuilder.DropIndex(
                name: "IX_InvoiceItems_FinanceItemID",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "Discount",
                table: "Invoices");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "FinanceItemID",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "InvoiceItems");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "InvoiceItems");

            migrationBuilder.RenameColumn(
                name: "FinanceItemID",
                table: "ContractFinances",
                newName: "ContractItemID");

            migrationBuilder.RenameIndex(
                name: "IX_ContractFinances_FinanceItemID",
                table: "ContractFinances",
                newName: "IX_ContractFinances_ContractItemID");

            migrationBuilder.CreateTable(
                name: "ContractItem",
                columns: table => new
                {
                    ContractItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    ItemName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContractItem", x => x.ContractItemID);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ContractFinances_ContractItem_ContractItemID",
                table: "ContractFinances",
                column: "ContractItemID",
                principalTable: "ContractItem",
                principalColumn: "ContractItemID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
