using DigitalFoundation.Common.Logging;
using DigitalFoundation.Common.Services.StartupConfiguration;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using FluentValidation;
using FluentValidation.AspNetCore;
using System;
using System.Net.Http;
using System.Net;
using AutoMapper;

namespace DigitalCommercePlatform.UIService.Customer
{
    [ExcludeFromCodeCoverage]
    public class Startup : BaseAppServiceStartup
    {
        protected override string HealthCheckEndpoint => "http://app-customer/health/heartbeat";

        public Startup(IConfiguration configuration, IStartupLogger startupLogger) : base(configuration, startupLogger)
        {
        }

        public override void AddBaseComponents(IServiceCollection services, IConfiguration configuration)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            services.AddAutoMapper(typeof(Startup));
        }
    }
}
