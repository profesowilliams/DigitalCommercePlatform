//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.SPA;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetSpa
{
    public class GetSpaHanderTests
    {
        private readonly Mock<ILoggerFactory> _loggerFactory;
        private readonly Mock<IConfigService> _iConfigService;
        private readonly Mock<IHttpClientFactory> _iHttpClientFactory;
        private readonly Mock<IMapper> _imapper;
        private readonly SPADetails.Handler _sut;


        public GetSpaHanderTests()
        {
            _loggerFactory = new Mock<ILoggerFactory>();
            _iConfigService = new Mock<IConfigService>();
            _iHttpClientFactory = new Mock<IHttpClientFactory>();
            _imapper = new Mock<IMapper>();
            _sut = new SPADetails.Handler(_imapper.Object, _loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_MustBeOk(SPADetails.Response expected)
        {
            //arrange
            _iConfigService.Setup(x => x.GetSPADetails(
                    It.IsAny<SPADetails.Request>()
                    ))
                .ReturnsAsync(expected);

            var handler = new SPADetails.Handler(_imapper.Object, _loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);

            //act
            var request = new SPADetails.Request
            {
               Details=true,
               ProductIds="OKJ908,SDTYB=78Hy",
               Id="249865"
            };

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            //assert
            result.Should().NotBeNull();
        }
    }
}
