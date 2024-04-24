using Microsoft.EntityFrameworkCore;

namespace Konane
{
    /// <summary>
    /// Program class.
    /// </summary>
    public class Program
    {
        public static void Main(string[] args)
        {
            
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllersWithViews();
            builder.Services.AddMvc();
            builder.Services.AddSignalR();
            
            builder.Services.AddDbContext<ApplicationContext>(options =>
            {
                options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(ApplicationContext)) ?? string.Empty);
            });
            builder.Services.AddScoped<UsersRepository>();
            builder.Services.AddScoped<RoomsRepository>();
            
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
            app.MapFallbackToFile("index.html");
            app.Run();
        }
    }
}