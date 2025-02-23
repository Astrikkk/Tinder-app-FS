using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class Test3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserProfileInterests");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "UserProfileInterests",
                columns: table => new
                {
                    UserProfileId = table.Column<int>(type: "int", nullable: false),
                    InterestId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfileInterests", x => new { x.UserProfileId, x.InterestId });
                    table.ForeignKey(
                        name: "FK_UserProfileInterests_Interests_InterestId",
                        column: x => x.InterestId,
                        principalTable: "Interests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserProfileInterests_Profiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserProfileInterests_InterestId",
                table: "UserProfileInterests",
                column: "InterestId");
        }
    }
}
