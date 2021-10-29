//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions
{
    public class GetQuotePreviewDetailsTest
    {
        private readonly Mock<ICommerceService> _mockCommerceService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<GetQuotePreviewDetails.Handler>> _logger;
        private readonly Mock<IQuoteItemChildrenService> _mockquoteItemChildrenService;

        public GetQuotePreviewDetailsTest()
        {
            _mockCommerceService = new();
            _mockquoteItemChildrenService = new();
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILogger<GetQuotePreviewDetails.Handler>>();
        }

        public string Id { get;private set; }
        public bool Details { get; private set; } = true;
        public bool IsEstimateId { get; private set; }
        public string Vendor { get; private set; }
        [Theory]
        [AutoDomainData]
        public async Task GetQuoteDetails(QuotePreviewModel expected)
        {
            _mockCommerceService.Setup(x => x.QuotePreview(
                      It.IsAny<GetQuotePreviewDetails.Request>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new GetQuotePreviewDetails.Handler(_mockCommerceService.Object, _mapper.Object, _logger.Object, _mockquoteItemChildrenService.Object);
            var request = new GetQuotePreviewDetails.Request(Id, IsEstimateId, Vendor);
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}
