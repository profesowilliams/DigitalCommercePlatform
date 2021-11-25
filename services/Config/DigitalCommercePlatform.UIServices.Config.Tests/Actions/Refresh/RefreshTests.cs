//2021 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Services;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using System.Threading;
using Xunit;
using ActionsRefresh = DigitalCommercePlatform.UIServices.Config.Actions.Refresh;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Refresh
{
    public class RefreshTests
    {
        private readonly Mock<ILoggerFactory> _loggerFactory;
        private readonly Mock<IConfigService> _iConfigService;
        private readonly Mock<IHttpClientFactory> _iHttpClientFactory;
        private readonly ActionsRefresh.Refresh.Handler _sut;

        public RefreshTests()
        {
            _loggerFactory = new Mock<ILoggerFactory>();
            _iConfigService = new Mock<IConfigService>();
            _iHttpClientFactory = new Mock<IHttpClientFactory>();
            _sut = new ActionsRefresh.Refresh.Handler(_loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);
        }

        [Fact]
        public async void Handle_MustBeOk()
        {
            //arrange
            var request = new ActionsRefresh.Refresh.Request 
            { 
                ProviderName = "Cisco",
                ConfigurationType = "Estimate"
            };
            _iConfigService.Setup(x => x.Refresh(request));

            //act
            await _sut.Handle(request, It.IsAny<CancellationToken>()).ConfigureAwait(false);

            //assert
            _iConfigService.Verify(x => x.Refresh(request), Times.Once);
        }
    }
}
