using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class Test6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatGuids");

            migrationBuilder.AddColumn<int>(
                name: "UserProfileId",
                table: "ProfilePhotos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProfilePhotos_UserProfileId",
                table: "ProfilePhotos",
                column: "UserProfileId");

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
                name: "FK_ProfilePhotos_Profiles_UserProfileId",
                table: "ProfilePhotos");

            migrationBuilder.DropIndex(
                name: "IX_ProfilePhotos_UserProfileId",
                table: "ProfilePhotos");

            migrationBuilder.DropColumn(
                name: "UserProfileId",
                table: "ProfilePhotos");

            migrationBuilder.CreateTable(
                name: "ChatGuids",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatorId = table.Column<int>(type: "int", nullable: false),
                    ParticipantId = table.Column<int>(type: "int", nullable: false),
                    ChatRoom = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserProfileId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatGuids", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatGuids_AspNetUsers_CreatorId",
                        column: x => x.CreatorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatGuids_AspNetUsers_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatGuids_Profiles_UserProfileId",
                        column: x => x.UserProfileId,
                        principalTable: "Profiles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatGuids_CreatorId",
                table: "ChatGuids",
                column: "CreatorId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGuids_ParticipantId",
                table: "ChatGuids",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatGuids_UserProfileId",
                table: "ChatGuids",
                column: "UserProfileId");
        }
    }
}
