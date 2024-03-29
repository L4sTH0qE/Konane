using System.Net;
using System.Net.Sockets;
using System.Net.WebSockets;
using WebSocketSharp;
using WebSocketSharp.Server;

namespace Konane
{
    public class Program
    {
        public static void Main(string[] args)
        {
            
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllersWithViews();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.UseWebSockets();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");
            
            app.Map("/ws", async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    Console.WriteLine($"Входящее подключение: {webSocket.State}");
                }
            });
            StartServer();
            app.MapFallbackToFile("index.html");
            app.Run();
        }
        
        private static void StartServer()
        {
            var server = new WebSocketServer("ws://localhost:8080");
            server.Start();
            Console.WriteLine("Сервер запущен. Ожидание подключений... ");
            /*var builder = WebApplication.CreateBuilder(args);
            var app = builder.Build();

            app.UseWebSockets();
            app.Map("/ws", async context =>
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    using var webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    Console.WriteLine($"Входящее подключение: {webSocket.State}");
                }
            });

            app.Run("http://localhost:8888");
            var tcpListener = new TcpListener(IPAddress.Any, 1234);
            try
            {
                tcpListener.Start();    // запускаем сервер
                Console.WriteLine("Сервер запущен. Ожидание подключений... ");
 
                while (true)
                {
                    // получаем подключение в виде TcpClient
                    using var tcpClient = await tcpListener.AcceptTcpClientAsync();
                    Console.WriteLine($"Входящее подключение: {tcpClient.Client.RemoteEndPoint}");
                }
            }
            finally
            {
                tcpListener.Stop(); // останавливаем сервер
            }*/
        }
    }
}