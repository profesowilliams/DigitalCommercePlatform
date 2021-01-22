using DigitalCommercePlatform.UIServices.Product.Controllers;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Reflection;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class ProductControllerTest
    {
        private readonly Mock<IContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<ProductController>> _logger;
        private readonly Mock<IOptions<AppSettings>> _optionsMock;
        private readonly Mock<ISiteSettings> _settings;

        public ProductControllerTest()
        {
            _mediator = new Mock<IMediator>();
            _context = new Mock<IContext>();
            _context.SetupGet(x => x.Language).Returns("en-us");
            _logger = new Mock<ILogger<ProductController>>();
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };

            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);

            var appSettingOptions = new Mock<IOptions<AppSettings>>();
            appSettingOptions.Setup(s => s.Value).Returns(appSettings);
            _optionsMock = appSettingOptions;

            _settings = new Mock<ISiteSettings>();
        }

        [Fact]
        public void Controller_AuthCheck()
        {
            //Arrange
            var methodInfo = typeof(ProductController).GetTypeInfo();

            //Act
            var anonymousAttribute = methodInfo.GetCustomAttribute<AllowAnonymousAttribute>();

            // Change this when auth attribute will be added to ProductController
            anonymousAttribute.Should().BeNull();
        }

        [Fact]
        public void Method_Request_AuthCheck()
        {
            //Arrange
            var methodInfo = typeof(ProductController).GetTypeInfo().GetMethods();

            //Act
            foreach (var m in methodInfo)
            {
                var anonymousAttribute = m.GetCustomAttribute<AllowAnonymousAttribute>();

                // Change this when auth attribute will be added to ProductController
                anonymousAttribute.Should().BeNull();
            }
        }
    }
}