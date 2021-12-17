//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Infrastructure;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class SecurityServiceTests
    {
        private readonly ISecurityService _securityService;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<ILogger<SecurityService>> _logger;
        //private readonly Mock<Globals> _global;


        public SecurityServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
            _logger = new Mock<ILogger<SecurityService>>();
            _uiContext = new Mock<IUIContext>();
            _appSettings.Setup(s => s.GetSetting("Core.Secuirty.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/core-security/v1");
            _appSettings.Setup(s => s.GetSetting("Aem.ClientId")).Returns("ecom.apps.web.aem.dit");
            _appSettings.Setup(s => s.GetSetting("Aem.ClientSecret")).Returns("akv:AEM-ClientSecret");
            _securityService = new SecurityService(_appSettings.Object, _middleTierHttpClient.Object, _uiContext.Object, _logger.Object);

        }

        [Fact]
        public async Task InHouseAccount_Test()
        {
            //Act
            var result = _securityService.GetInHouseAccount();
            //Assert
            Assert.NotNull(result);
        }


        [Fact]
        public async Task GetUser_Test()
        {
            //Act
            var result = await _securityService.GetUser("AEM");
            //Assert
            Assert.Null(result);
        }
    }
}
