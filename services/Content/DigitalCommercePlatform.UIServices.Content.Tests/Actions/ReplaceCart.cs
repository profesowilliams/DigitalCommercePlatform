//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Content.Tests.Actions
{
    public class ReplaceCart
    {
        private readonly Mock<IContentService> _mockContentService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<Content.Actions.ReplaceCartQuotes.ReplaceCart.Handler>> _logger;

        public ReplaceCart()
        {
            _mockContentService = new();
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILogger<Content.Actions.ReplaceCartQuotes.ReplaceCart.Handler>>();
        }

        public string Id { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetReplaceCart(ResponseBase<Content.Actions.ReplaceCartQuotes.ReplaceCart.Response> expected)
        {
            _mockContentService.Setup(x => x.ReplaceCart(
                     It.IsAny<Content.Actions.ReplaceCartQuotes.ReplaceCart.Request>()
                     ))
                 .ReturnsAsync(expected);

            var handler = new Content.Actions.ReplaceCartQuotes.ReplaceCart.Handler(_mockContentService.Object, _mapper.Object, _logger.Object);


            var request = new Content.Actions.ReplaceCartQuotes.ReplaceCart.Request("id","type");

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }

    public abstract class ReplaceCartValidator
    {
        protected static Content.Actions.ReplaceCartQuotes.ReplaceCart.Validator GetValidator()
        {
            return new Content.Actions.ReplaceCartQuotes.ReplaceCart.Validator();
        }
    }
}
