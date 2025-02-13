using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class addingroles2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interests_Profiles_ProfileId",
                table: "Interests");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId1",
                table: "ProfilePhotos");

            migrationBuilder.RenameColumn(
                name: "ProfileId1",
                table: "ProfilePhotos",
                newName: "UserProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_ProfilePhotos_ProfileId1",
                table: "ProfilePhotos",
                newName: "IX_ProfilePhotos_UserProfileId");

            migrationBuilder.RenameColumn(
                name: "ProfileId",
                table: "Interests",
                newName: "UserProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Interests_ProfileId",
                table: "Interests",
                newName: "IX_Interests_UserProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_Profiles_UserProfileId",
                table: "Interests",
                column: "UserProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfilePhotos_Profiles_UserProfileId",
                table: "ProfilePhotos",
                column: "UserProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interests_Profiles_UserProfileId",
                table: "Interests");

            migrationBuilder.DropForeignKey(
                name: "FK_ProfilePhotos_Profiles_UserProfileId",
                table: "ProfilePhotos");

            migrationBuilder.RenameColumn(
                name: "UserProfileId",
                table: "ProfilePhotos",
                newName: "ProfileId1");

            migrationBuilder.RenameIndex(
                name: "IX_ProfilePhotos_UserProfileId",
                table: "ProfilePhotos",
                newName: "IX_ProfilePhotos_ProfileId1");

            migrationBuilder.RenameColumn(
                name: "UserProfileId",
                table: "Interests",
                newName: "ProfileId");

            migrationBuilder.RenameIndex(
                name: "IX_Interests_UserProfileId",
                table: "Interests",
                newName: "IX_Interests_ProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_Profiles_ProfileId",
                table: "Interests",
                column: "ProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ProfilePhotos_Profiles_ProfileId1",
                table: "ProfilePhotos",
                column: "ProfileId1",
                principalTable: "Profiles",
                principalColumn: "Id");
        }
    }
}
