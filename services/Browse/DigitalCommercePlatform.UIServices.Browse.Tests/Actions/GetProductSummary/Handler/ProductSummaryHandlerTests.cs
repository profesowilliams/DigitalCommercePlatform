using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Find;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class ProductSummaryHandlerTests
    {
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<IMapper> _mapper;

        public ProductSummaryHandlerTests()
        {
            _mapper = new Mock<IMapper>();
            _mockBrowseService = new();
        }

        public bool withPaginationInfo { get; private set; }
        [Theory]
        [AutoDomainData]
        public async Task FindProductHandler(ProductData expected, FindProductModel query)
        {
            _mockBrowseService.Setup(x => x.FindProductDetails(
                       It.IsAny<FindProductHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new FindProductHandler.Handler(_mockBrowseService.Object, _mapper.Object);

            var request = new FindProductHandler.Request(query, withPaginationInfo);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindSummaryHandler(SummaryDetails expected, FindProductModel query)
        {
            _mockBrowseService.Setup(x => x.FindSummaryDetails(
                       It.IsAny<FindSummaryHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new FindSummaryHandler.Handler(_mockBrowseService.Object, _mapper.Object);

            var request = new FindSummaryHandler.Request(query, withPaginationInfo);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}

