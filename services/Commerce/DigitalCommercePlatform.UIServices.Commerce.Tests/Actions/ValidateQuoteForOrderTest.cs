//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
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
    public class ValidateQuoteForOrderTest
    {

        private readonly Mock<ICommerceService> _mockCommerceService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<ValidateQuoteForOrder.Handler>> _logger;


        public ValidateQuoteForOrderTest()
        {
            _mockCommerceService = new();
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILogger<ValidateQuoteForOrder.Handler>>();
        }

        public string Id { get; private set; }
        public bool LatestRevision { get; private set; } = true;
        [Theory]
        [AutoDomainData]
        public async Task GetQuoteDetails(ValidateQuoteForOrder.Response expected)
        {
            _mockCommerceService.Setup(x => x.IsValidDealForQuote(
                      It.IsAny<ValidateQuoteForOrder.Request>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new ValidateQuoteForOrder.Handler(_mockCommerceService.Object, _mapper.Object, _logger.Object);
            var request = new ValidateQuoteForOrder.Request(Id, LatestRevision);
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}