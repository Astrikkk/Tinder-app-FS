using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TinderApp.Migrations
{
    /// <inheritdoc />
    public partial class Test7 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "tbl_chat_messages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: false),
                    ChatKeyId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Readed = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tbl_chat_messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_tbl_chat_messages_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_tbl_chat_messages_ChatKeys_ChatKeyId",
                        column: x => x.ChatKeyId,
                        principalTable: "ChatKeys",
                        principalColumn: "ChatRoom",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_messages_ChatKeyId",
                table: "tbl_chat_messages",
                column: "ChatKeyId");

            migrationBuilder.CreateIndex(
                name: "IX_tbl_chat_messages_SenderId",
                table: "tbl_chat_messages",
                column: "SenderId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "tbl_chat_messages");
        }
    }
}
