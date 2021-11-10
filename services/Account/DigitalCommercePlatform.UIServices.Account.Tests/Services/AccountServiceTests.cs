//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using RenewalsService;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class AccountServiceTests
    {
        private readonly IAccountService _accountService;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<AccountService>> _logger;
        private readonly Mock<IRenewalsService> _renewalsService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IAppSettings> _appSettings;

        public AccountServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<AccountService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("App.Configuration.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-configuration/v1");
            _appSettings.Setup(s => s.GetSetting("App.Order.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1");
            _appSettings.Setup(s => s.GetSetting("App.Quote.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1");
            _appSettings.Setup(s => s.GetSetting("App.Cart.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-cart/v1");
            _appSettings.Setup(s => s.GetSetting("App.Price.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-price/v1");
            _appSettings.Setup(s => s.GetSetting("App.Customer.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-customer/v1");
            _uiContext = new Mock<IUIContext>();
            _mapper = new Mock<IMapper>();
            _renewalsService = new Mock<IRenewalsService>();
            _uiContext = new Mock<IUIContext>();

            _accountService = new AccountService(_middleTierHttpClient.Object,
                _appSettings.Object,
                _logger.Object,
                _mapper.Object,
                _renewalsService.Object,
                _uiContext.Object
                );
        }


        [Fact]
        public async Task GetConfigurationsSummaryAsync_Test()
        {
            //arrange 
            GetConfigurationsSummary.Request request = new();
            request.Criteria = "123";
            //Act
            var result = _accountService.GetConfigurationsSummaryAsync(request);
            //Assert
            Assert.NotNull(result);
        }
    }
}
