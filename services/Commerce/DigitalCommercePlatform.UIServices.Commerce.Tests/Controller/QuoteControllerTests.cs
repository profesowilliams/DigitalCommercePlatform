//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Controllers;
using DigitalCommercePlatform.UIServices.Commerce.Models.Enums;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Controller
{
    public class QuoteControllerTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ILogger<QuoteController>> _logger;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public QuoteControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _context = new Mock<IUIContext>();
            _context.Setup(s => s.Site).Returns("US"); // Necessary for getting activeCart and savedCart
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<QuoteController>>();
            _siteSettings = new Mock<ISiteSettings>();
        }

        private QuoteController GetController()
        {
            return new QuoteController(_mediator.Object, _appSettingsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task CreateQuoteTest(ResponseBase<CreateQuote.Response> expected)
        {
            // Arrange
            _mediator.Setup(x => x.Send(It.IsAny<CreateQuote.Request>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var controller = GetController();
            var createModel = new QuotePreviewModel();
           
            // Act
            var result = await controller.Create(createModel).ConfigureAwait(false);
            
            // Assert
             _mediator.Verify(x => x.Send(It.IsAny<CreateQuote.Request>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task CreateQuoteFromTest(ResponseBase<CreateQuoteFrom.Response> expected)
        {
            // Arrange
            _mediator.Setup(x => x.Send(It.IsAny<CreateQuoteFrom.Request>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var controller = GetController();
            var createModelFrom = new CreateModelFrom();
            // Act
            var result = await controller.CreateFrom(createModelFrom).ConfigureAwait(false);
            // Assert
            _mediator.Verify(x => x.Send(It.IsAny<CreateQuoteFrom.Request>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CreateQuoteFromTestMissingCreateTypeId()
        {
            // Arrange
            var validator = new CreateQuoteFrom.Validator();
            var createFrom = new CreateModelFrom()
            {
                CreateFromType = QuoteCreationSourceType.SavedCart,
            };
            var cmd = new CreateQuoteFrom.Request(createFrom);
            // Act
            var validationResult = await validator.ValidateAsync(cmd);
            // Assert
            Assert.False(validationResult.IsValid);
        }

        [Theory]
        [AutoDomainData]
        public async Task UpdateQuoteTest(ResponseBase<UpdateQuote.Response> expected)
        {
            // Arrange
            _mediator.Setup(x => x.Send(It.IsAny<UpdateQuote.Request>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(expected);

            var controller = GetController();
            var quoteToUpdate = new UpdateModel
            {
                QuoteId = "123456",
            };
            // Act
            var result = await controller.Update(quoteToUpdate).ConfigureAwait(false);
            // Assert
            _mediator.Verify(x => x.Send(It.IsAny<UpdateQuote.Request>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdateQuoteTestTestMissingCreateTypeId()
        {
            // Arrange
            var validator = new UpdateQuote.Validator();
            var updateModel = new UpdateModel();
            var cmd = new UpdateQuote.Request(updateModel);
            // Act
            var validationResult = await validator.ValidateAsync(cmd);
            // Assert
            Assert.False(validationResult.IsValid);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetQuotePreview(ResponseBase<GetQuotePreviewDetails.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<GetQuotePreviewDetails.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetQuotePreview("1234", true, "cisco", "Deal").ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetQuoteDetails(ResponseBase<GetQuote.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetQuote.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var data = new List<string> { "123" };
            var controller = GetController();
            var result = await controller.GetQuoteDetails(data, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }


        [Theory]
        [AutoDomainData]
        public async Task GetRecentQuotes(ResponseBase<GetQuotesForGrid.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<GetQuotesForGrid.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            GetQuotesForGrid.Request inputDetails = new GetQuotesForGrid.Request
            {
                CreatedBy = "",
                QuoteIdFilter = "123",
                VendorReference = "123",
                SortBy = "123",
                SortDirection = "asc",
                PageSize = 1,
                PageNumber = 10,
                WithPaginationInfo = true,
            };

            var controller = GetController();
            var result = await controller.GetRecentQuotes(inputDetails).ConfigureAwait(false);
            result.Should().NotBeNull();
        }
    }
}
