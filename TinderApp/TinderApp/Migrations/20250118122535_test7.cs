using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class test7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfilePhotos_AspNetUsers_UserId",
                table: "ProfilePhotos");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId",
                table: "ProfilePhotos");

            migrationBuilder.DropIndex(
                name: "IX_ProfilePhotos_UserId",
                table: "ProfilePhotos");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ProfilePhotos");

            migrationBuilder.AlterColumn<int>(
                name: "ProfileId",
                table: "ProfilePhotos",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProfileId1",
                table: "ProfilePhotos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProfilePhotos_ProfileId1",
                table: "ProfilePhotos",
                column: "ProfileId1");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId",
                table: "ProfilePhotos",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId1",
                table: "ProfilePhotos",
                column: "ProfileId1",
                principalTable: "Profiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId",
                table: "ProfilePhotos");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId1",
                table: "ProfilePhotos");

            migrationBuilder.DropIndex(
                name: "IX_ProfilePhotos_ProfileId1",
                table: "ProfilePhotos");

            migrationBuilder.DropColumn(
                name: "ProfileId1",
                table: "ProfilePhotos");

            migrationBuilder.AlterColumn<int>(
                name: "ProfileId",
                table: "ProfilePhotos",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "ProfilePhotos",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ProfilePhotos_UserId",
                table: "ProfilePhotos",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfilePhotos_AspNetUsers_UserId",
                table: "ProfilePhotos",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId",
                table: "ProfilePhotos",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");
        }
    }
}
