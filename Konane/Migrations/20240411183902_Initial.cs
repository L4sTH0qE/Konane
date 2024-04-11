using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Konane.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    RoomId = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    FirstPlayer = table.Column<string>(type: "text", nullable: true),
                    SecondPlayer = table.Column<string>(type: "text", nullable: true),
                    CurrentPlayer = table.Column<string>(type: "text", nullable: true),
                    Board = table.Column<string>(type: "text", nullable: true),
                    FirstTurnFinished = table.Column<bool>(type: "boolean", nullable: false),
                    SecondTurnFinished = table.Column<bool>(type: "boolean", nullable: false),
                    FirstFirstTurn = table.Column<bool>(type: "boolean", nullable: false),
                    SecondFirstTurn = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Wins = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rooms");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
