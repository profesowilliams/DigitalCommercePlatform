//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Spa;
using DigitalCommercePlatform.UIServices.Commerce.Models.SPA;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions
{
    public class SpaDetailsTest
    {
        private readonly Mock<ICommerceService> _mockCommerceService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILoggerFactory> _logger;
        private readonly Mock<IHttpClientFactory> _httpClientFactory;

        public SpaDetailsTest()
        {
            _mockCommerceService = new();
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILoggerFactory>();
            _httpClientFactory = new Mock<IHttpClientFactory>();
        }


        List<SPAProduct> lstSpaProducts = new List<SPAProduct>();

        SPAProduct spaProduct = new SPAProduct()
        {
            UnitListPrice = 1M,
            ManufacturerPartNo = "MNV-TST-123-o",
            TDPartNo = "tdbv7826",
            Quantity = 30M
        };


        SpaDetails.Request Request = new SpaDetails.Request();


        [Theory]
        [AutoDomainData]
        public async Task GetSpaDetails(SpaDetails.Response expected)
        {
            _mockCommerceService.Setup(x => x.CanApplySPA(
                      It.IsAny<SpaDetails.Request>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new SpaDetails.Handler(_mapper.Object, _logger.Object, _mockCommerceService.Object, _httpClientFactory.Object);
            var request = new SpaDetails.Request();
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}
