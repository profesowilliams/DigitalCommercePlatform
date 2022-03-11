//2021 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using ActionsRefresh = DigitalCommercePlatform.UIServices.Account.Actions.Refresh;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Actions.Refresh
{
    public class RefreshTests
    {
        private readonly Mock<ILoggerFactory> _loggerFactory;
        private readonly Mock<IVendorService> _vendorService;
        private readonly Mock<IHttpClientFactory> _iHttpClientFactory;
        private readonly Mock<IMapper> _imapper;
        private readonly ActionsRefresh.RefreshData.Handler _sut;

        public RefreshTests()
        {
            _loggerFactory = new Mock<ILoggerFactory>();
            _vendorService = new Mock<IVendorService>();
            _iHttpClientFactory = new Mock<IHttpClientFactory>();
            _imapper = new Mock<IMapper>();
            _sut = new ActionsRefresh.RefreshData.Handler(_vendorService.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_MustBeOk(ActionsRefresh.RefreshData.Response expected)
        {
            //arrange
            _vendorService.Setup(x => x.RefreshVendor(
                    It.IsAny<ActionsRefresh.RefreshData.Request>()
                    ))
                .Returns(expected);

            var handler = new ActionsRefresh.RefreshData.Handler( _vendorService.Object);

            //act
            var request = new ActionsRefresh.RefreshData.Request
            {
                VendorName = "Cisco",
                Type = "Estimate",
                Version = "1",
                FromDate = System.DateTime.Now.AddDays(30).Date, 
                From = "yesterday"
            };

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            //assert
            result.Should().NotBeNull();
        }
    }
}
