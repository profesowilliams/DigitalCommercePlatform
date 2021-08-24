//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Summary;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class ProductDetailsHandlerTests
    {
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<IMapper> _mapper;

        public ProductDetailsHandlerTests()
        {
            _mockBrowseService = new();
            _mapper = new Mock<IMapper>();
        }

        public IReadOnlyCollection<string> Id { get; private set; }
        public bool Details { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(IEnumerable<ProductModel> expected)
        {
            _mockBrowseService.Setup(x => x.GetProductDetails(
                       It.IsAny<GetProductDetailsHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetProductDetailsHandler.Handler(_mockBrowseService.Object, _mapper.Object);

            var request = new GetProductDetailsHandler.Request(Id,Details);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductSummary(SummaryModel expected)
        {
            _mockBrowseService.Setup(x => x.GetProductSummary(
                       It.IsAny<GetProductSummaryHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetProductSummaryHandler.Handler(_mockBrowseService.Object, _mapper.Object);

            var request = new GetProductSummaryHandler.Request(Id, Details);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}

