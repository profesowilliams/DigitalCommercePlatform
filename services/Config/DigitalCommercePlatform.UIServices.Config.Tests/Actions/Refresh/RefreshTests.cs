//2021 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using ActionsRefresh = DigitalCommercePlatform.UIServices.Config.Actions.Refresh;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Refresh
{
    public class RefreshTests
    {
        private readonly Mock<ILoggerFactory> _loggerFactory;
        private readonly Mock<IConfigService> _iConfigService;
        private readonly Mock<IHttpClientFactory> _iHttpClientFactory;
        private readonly Mock<IMapper> _imapper;
        private readonly ActionsRefresh.RefreshData.Handler _sut;

        public RefreshTests()
        {
            _loggerFactory = new Mock<ILoggerFactory>();
            _iConfigService = new Mock<IConfigService>();
            _iHttpClientFactory = new Mock<IHttpClientFactory>();
            _imapper = new Mock<IMapper>();
            _sut = new ActionsRefresh.RefreshData.Handler(_imapper.Object,_loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_MustBeOk(ActionsRefresh.RefreshData.Response expected)
        {
            //arrange
            _iConfigService.Setup(x => x.RefreshVendor(
                    It.IsAny<ActionsRefresh.RefreshData.Request>()
                    ))
                .ReturnsAsync(expected);

            var handler = new ActionsRefresh.RefreshData.Handler( _imapper.Object, _loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);

            //act
            var request = new ActionsRefresh.RefreshData.Request
            {
                VendorName = "Cisco",
                Type = "Estimate",
                Version = "1"
            };

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            //assert
            result.Should().NotBeNull();
        }
    }
}
