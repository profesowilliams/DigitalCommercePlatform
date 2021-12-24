//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.ProductPrice;
using DigitalCommercePlatform.UIServices.Config.Actions.SPA;
using DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.ProductPrice
{
    public class GetProductPriceTests
    {
        private readonly Mock<ILoggerFactory> _loggerFactory;
        private readonly Mock<IConfigService> _iConfigService;
        private readonly Mock<IHttpClientFactory> _iHttpClientFactory;
        private readonly Mock<IMapper> _imapper;
        private readonly SPADetails.Handler _sut;


        public GetProductPriceTests()
        {
            _loggerFactory = new Mock<ILoggerFactory>();
            _iConfigService = new Mock<IConfigService>();
            _iHttpClientFactory = new Mock<IHttpClientFactory>();
            _imapper = new Mock<IMapper>();
            _sut = new SPADetails.Handler(_imapper.Object, _loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handle_MustBeOk(GetProductPrice.Response expected)
        {
            //arrange
            _iConfigService.Setup(x => x.GetProductPrice(
                    It.IsAny<GetProductPrice.Request>()
                    ))
                .ReturnsAsync(expected);

            var handler = new GetProductPrice.Handler(_imapper.Object, _loggerFactory.Object, _iConfigService.Object, _iHttpClientFactory.Object);

            //act
            PriceCriteriaModel price = new PriceCriteriaModel();
            GetProductPrice.Request request = new GetProductPrice.Request(price);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            //assert
            result.Should().NotBeNull();
        }
    }
}
