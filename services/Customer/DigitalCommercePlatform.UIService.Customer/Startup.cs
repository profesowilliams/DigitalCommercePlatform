using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using FluentValidation;
using FluentValidation.AspNetCore;
using DigitalCommercePlatform.UIServices.Customer.Actions.Customer.Get;
using DigitalCommercePlatform.UIService.Customer.Services;
using DigitalCommercePlatform.UIService.Customer.Services.Abstract;
using System;
using System.Net.Http;
using System.Net;
using AutoMapper;

namespace DigitalCommercePlatform.UIService.Customer
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        protected override string HealthCheckEndpoint => "https://service.dit.df.svc.us.tdworldwide.com/app-customer/health/heartbeat";

        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddAutoMapper(typeof(Startup));
            services.AddHttpClient("AppServicesCustomerClient", c =>
            {
                c.BaseAddress = new Uri(Configuration.GetValue<string>("AppServicesCustomer"));
                c.DefaultRequestHeaders.Add("Accept", "application/xml");

            })
                //.ConfigurePrimaryHttpMessageHandler(() =>
                //{
                //    return new HttpClientHandler()
                //    {
                //        UseDefaultCredentials = true,
                //        Credentials = new NetworkCredential(Configuration.GetValue<string>("UserName"),
                //        Configuration.GetValue<string>("Password")),
                //    };
                //})
                ;

            services.AddScoped<IAppServiceConnector, AppServiceConnector>();
        }

        public override void ConfigureServices(IServiceCollection services)
        {
            base.ConfigureServices(services);
            services
                .AddMvc()
                .AddFluentValidation(config =>
                {
                    config.RegisterValidatorsFromAssemblyContaining<Validator>();
                })
        ;
        }
    }
}
