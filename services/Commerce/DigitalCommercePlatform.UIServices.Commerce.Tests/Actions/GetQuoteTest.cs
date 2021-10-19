//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions
{
    public class GetQuoteTest
    {
        private readonly Mock<ICommerceService> _mockCommerceService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<GetQuote.Handler>> _logger;
        private readonly Mock<IQuoteItemChildrenService> _mockquoteItemChildrenService;

        public GetQuoteTest()
        {
            _mockCommerceService = new();
            _mockquoteItemChildrenService = new();
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILogger<GetQuote.Handler>>();
        }

        public IReadOnlyCollection<string> Id { get; private set; }
        public bool Details { get; private set; } = true;
        [Theory]
        [AutoDomainData]
        public async Task GetQuoteDetails(QuoteModel expected)
        {
            _mockCommerceService.Setup(x => x.GetQuote(
                      It.IsAny<GetQuote.Request>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new GetQuote.Handler(_mockCommerceService.Object, _mapper.Object,_logger.Object,_mockquoteItemChildrenService.Object);
            var request = new GetQuote.Request(Id,Details);
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}
