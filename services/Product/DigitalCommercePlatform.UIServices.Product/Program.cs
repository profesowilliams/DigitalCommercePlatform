using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Logging;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        private static IConfigurationRoot _config;

        public static void Main(string[] args)
        {
            _config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .AddCommandLine(args)
                .AddEnvironmentVariables()
                .Build();

           
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(_config)
                .CreateLogger();
            try
            {
                Log.Information($"The {typeof(Program).FullName.Replace(".", " ", StringComparison.InvariantCulture)} is starting.");

                CreateWebHost(args).Build().Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, $"The {typeof(Program).FullName.Replace(".", " ", StringComparison.InvariantCulture)} failed to start.");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IWebHostBuilder CreateWebHost(string[] args)
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseKestrel(o => { o.AllowSynchronousIO = true; o.ListenAnyIP(_config.GetPortNumberFromArguments()); })
                .ConfigureServices(service => service.AddScoped<IStartupLogger, StartupLogger>())
                .UseIISIntegration()
                .UseSerilog()
                .UseStartup<Startup>();
        }
    }
}
