using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddingCreatedBy3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Users_UsersUserID",
                table: "Contracts");

            migrationBuilder.DropIndex(
                name: "IX_Contracts_UsersUserID",
                table: "Contracts");

            migrationBuilder.DropColumn(
                name: "UsersUserID",
                table: "Contracts");

            migrationBuilder.CreateIndex(
                name: "IX_Contracts_UserID",
                table: "Contracts",
                column: "UserID");

            migrationBuilder.AddForeignKey(
                name: "FK_Contracts_Users_UserID",
                table: "Contracts",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Contracts_Users_UserID",
                table: "Contracts");

            migrationBuilder.DropIndex(
                name: "IX_Contracts_UserID",
                table: "Contracts");

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
    }
}
