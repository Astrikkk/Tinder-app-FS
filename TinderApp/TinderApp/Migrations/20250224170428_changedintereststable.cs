using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class changedintereststable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Interests_Profiles_UserProfileId",
                table: "Interests");

            migrationBuilder.DropIndex(
                name: "IX_Interests_UserProfileId",
                table: "Interests");

            migrationBuilder.DropColumn(
                name: "UserProfileId",
                table: "Interests");

            migrationBuilder.CreateTable(
                name: "InterestUserProfile",
                columns: table => new
                {
                    InterestsId = table.Column<int>(type: "int", nullable: false),
                    UserProfilesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InterestUserProfile", x => new { x.InterestsId, x.UserProfilesId });
                    table.ForeignKey(
                        name: "FK_InterestUserProfile_Interests_InterestsId",
                        column: x => x.InterestsId,
                        principalTable: "Interests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InterestUserProfile_Profiles_UserProfilesId",
                        column: x => x.UserProfilesId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_InterestUserProfile_UserProfilesId",
                table: "InterestUserProfile",
                column: "UserProfilesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InterestUserProfile");

            migrationBuilder.AddColumn<int>(
                name: "UserProfileId",
                table: "Interests",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Interests_UserProfileId",
                table: "Interests",
                column: "UserProfileId");

            migrationBuilder.AddForeignKey(
                name: "FK_Interests_Profiles_UserProfileId",
                table: "Interests",
                column: "UserProfileId",
                principalTable: "Profiles",
                principalColumn: "Id");
        }
    }
}
