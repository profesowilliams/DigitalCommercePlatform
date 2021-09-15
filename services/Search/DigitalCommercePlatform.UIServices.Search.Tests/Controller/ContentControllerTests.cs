//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions;
using DigitalCommercePlatform.UIServices.Search.Actions.ActiveCart;
using DigitalCommercePlatform.UIServices.Search.Actions.CreateCartByQuote;
using DigitalCommercePlatform.UIServices.Search.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Controllers;
using DigitalCommercePlatform.UIServices.Search.Models.Cart;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Controller
{
    public class ContentControllerTests
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<ContentController>> _mockLoggerFactory;
        private readonly Mock<IUIContext> _mockContext;
        private readonly Mock<ISiteSettings> _mockSiteSettings;

        public ContentControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _mockMediator = new Mock<IMediator>();

            _mockLoggerFactory = new Mock<ILogger<ContentController>>();
            _mockContext = new Mock<IUIContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        private ContentController GetController()
        {
            return new ContentController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _appSettingsMock.Object, _mockSiteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetSavedCartDetails(ResponseBase<GetSavedCartDetails.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetSavedCartDetails.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetSavedCartDetails("12", true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetActiveCartDetails(ResponseBase<GetActiveCart.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetActiveCart.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetActiveCartDetails().ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task TypeAheadSearch(ResponseBase<TypeAheadSearch.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<TypeAheadSearch.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.TypeAheadSearch("12", 123, "ProductType").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task AddItremsToCart(ResponseBase<AddCartItem.Response> expected)
        {
            // Arrange
            _mockMediator.Setup(x => x.Send(It.IsAny<AddCartItem.Request>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var controller = GetController();
            var itemModels = new List<CartItemModel>();
            // Act
            var result = await controller.AddItemsToCart(itemModels).ConfigureAwait(false);
            // Assert
            _mockMediator.Verify(x => x.Send(It.IsAny<AddCartItem.Request>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task CreateCartByQuote(ResponseBase<GetCreateCartByQuote.Response> expected)
        {
            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetCreateCartByQuote.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.CreateByQuote("12").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Fact]
        public async Task CreateCartByQuoteValidation()
        {
            // Arrange
            var validator = new GetCreateCartByQuote.Validator();
            string QuoteId = "1234";
            var cmd = new GetCreateCartByQuote.Request(QuoteId);
            // Act
            var validationResult = await validator.ValidateAsync(cmd);
            // Assert
            Assert.True(validationResult.IsValid);
        }
    }
}
