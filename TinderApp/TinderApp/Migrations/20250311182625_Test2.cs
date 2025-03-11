using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class Test2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChatKeys_AspNetUsers_UserEntityId",
                table: "ChatKeys");

            migrationBuilder.DropIndex(
                name: "IX_ChatKeys_UserEntityId",
                table: "ChatKeys");

            migrationBuilder.DropColumn(
                name: "UserEntityId",
                table: "ChatKeys");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserEntityId",
                table: "ChatKeys",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChatKeys_UserEntityId",
                table: "ChatKeys",
                column: "UserEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChatKeys_AspNetUsers_UserEntityId",
                table: "ChatKeys",
                column: "UserEntityId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
