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
            migrationBuilder.DropIndex(
                name: "IX_ChatKeys_CreatorId",
                table: "ChatKeys");

            migrationBuilder.CreateIndex(
                name: "IX_ChatKeys_CreatorId_ParticipantId",
                table: "ChatKeys",
                columns: new[] { "CreatorId", "ParticipantId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ChatKeys_CreatorId_ParticipantId",
                table: "ChatKeys");

            migrationBuilder.CreateIndex(
                name: "IX_ChatKeys_CreatorId",
                table: "ChatKeys",
                column: "CreatorId");
        }
    }
}
