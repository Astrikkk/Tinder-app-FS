using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class AddLocationAndAgeFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaxAge",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinAge",
                table: "Profiles",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowMe",
                table: "Profiles",
                type: "boolean",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Profiles_LocationId",
                table: "Profiles",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Profiles_Countries_LocationId",
                table: "Profiles",
                column: "LocationId",
                principalTable: "Countries",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Profiles_Countries_LocationId",
                table: "Profiles");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropIndex(
                name: "IX_Profiles_LocationId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "MaxAge",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "MinAge",
                table: "Profiles");

            migrationBuilder.DropColumn(
                name: "ShowMe",
                table: "Profiles");
        }
    }
}
