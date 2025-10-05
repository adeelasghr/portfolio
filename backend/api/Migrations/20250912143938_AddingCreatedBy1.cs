using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddingCreatedBy1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleType",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehiclePart",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleModel",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleImage",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleHistory",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleGroups",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleChangeHistory",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "VehicleBrand",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Vehicle",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Transmission",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Maintenances",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "MaintenanceItems",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Locations",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Invoices",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "InvoiceItems",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Inspections",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "FuelType",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "FinanceItems",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "DamageLocations",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "DamageCategory",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "CustomerDoc",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Customer",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Contracts",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "ContractFinances",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "ContractAddOns",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Bookings",
                newName: "UserID");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "AddOns",
                newName: "UserID");

            migrationBuilder.AddColumn<string>(
                name: "Roles",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Roles",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleType",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehiclePart",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleModel",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleImage",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleHistory",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleGroups",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleChangeHistory",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "VehicleBrand",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Vehicle",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Transmission",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Maintenances",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "MaintenanceItems",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Locations",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Invoices",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "InvoiceItems",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Inspections",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "FuelType",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "FinanceItems",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "DamageLocations",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "DamageCategory",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "CustomerDoc",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Customer",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Contracts",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "ContractFinances",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "ContractAddOns",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "Bookings",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "UserID",
                table: "AddOns",
                newName: "CreatedBy");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                table: "Users",
                type: "int",
                nullable: true);
        }
    }
}
