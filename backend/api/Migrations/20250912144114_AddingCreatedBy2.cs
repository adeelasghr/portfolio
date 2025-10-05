using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddingCreatedBy2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ClosingSignatures",
                table: "Contracts",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsersUserID",
                table: "Contracts",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_UsersUserID",
                table: "Contracts",
                column: "UsersUserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Users_UsersUserID",
                table: "Contracts",
                column: "UsersUserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Users_UsersUserID",
                table: "Contracts");

            migrationBuilder.DropIndex(
                name: "IX_Contracts_UsersUserID",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "ClosingSignatures",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "UsersUserID",
                table: "Contracts");
        }
    }
}
