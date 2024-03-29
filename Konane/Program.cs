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
            builder.Services.AddMvc();
            builder.Services.AddSignalR();
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseDeveloperExceptionPage();
            app.UseDefaultFiles();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{id?}");
            
            /*app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<NotificationHub>("/user");
            });*/

            app.MapFallbackToFile("index.html");
            app.Run();
        }
    }
}