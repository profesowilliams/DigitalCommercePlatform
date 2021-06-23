using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Actions.QuotePreviewDetail;
using DigitalCommercePlatform.UIServices.Commerce.Controllers;
using DigitalCommercePlatform.UIServices.Commerce.Models.Enums;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalFoundation.Common.Contexts;
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
            var createModel = new CreateQuoteModel();
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

        //[Theory]
        //[AutoDomainData]
        //public async Task GetCartDetailsInQuote(ResponseBase<DetailsOfSavedCartsQuote.Response> expected)
        //{
        //    _mediator.Setup(x => x.Send(
        //              It.IsAny<DetailsOfSavedCartsQuote.Request>(),
        //              It.IsAny<CancellationToken>()))
        //          .ReturnsAsync(expected);

        //    var controller = GetController();

        //    var result = await controller.GetCartDetailsInQuote("1234").ConfigureAwait(false);

        //    result.Should().NotBeNull();
        //}

        [Theory]
        [AutoDomainData]
        public async Task GetQuotePreview(ResponseBase<GetQuotePreviewDetails.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                      It.IsAny<GetQuotePreviewDetails.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetQuotePreview("1234").ConfigureAwait(false);

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

        //[Theory]
        //[AutoDomainData]
        //public async Task FindQuoteDetails(ResponseBase<GetQuotesForGrid.Response> expected)
        //{
        //    _mediator.Setup(x => x.Send(
        //               It.IsAny<GetQuotesForGrid.Request>(),
        //               It.IsAny<CancellationToken>()))
        //           .ReturnsAsync(expected);

        //    var detailsInput = new FindModel()
        //    {
        //     Id = "123",
        //     CustomerName=  "123",
        //     CustomerNumber="123",
        //     Active = "123",
        //     CreatedBy = "123",
        //     SalesTeamId = "123",
        //     SalesTeamName = "123",
        //     SalesAreaName = "123",
        //     SuperSalesAreaName = "123",
        //     QuoteType = "123",
        //     Manufacturer = "123",
        //     OrderId = "123",
        //     Material = "123",
        //     ManufacturerPart = "123",
        //     CustomerPart = "123",
        //     ShipToName = "123",
        //     EndUserName = "123",
        //     CustomerPO = "123",
        //     EndUserPO = "123",
        //     RevenueMaxThreshold =101,
        //     RevenueMinThreshold = 101,
        //     TDUAN = "123",
        //     VendorAgreement = "123",
        //     WorkflowId = "123",
        //     SalesOrg = "123",
        //     AccountOwner = "123",
        //     DirectorId = "123",
        //     DirectorName = "123",
        //     BusinessManagerId = "123",
        //     BusinessManagerName = "123",
        //     DivisionManagerId = "123",
        //     DivisionManagerName = "123",
        //     VendorSalesAssociate = "123",
        //     VendorSalesRep = "123",
        //     Description ="123",
        //     SortBy ="123",
        //     SortAscending =true,
        //     Page  = 1,
        //     PageSize  = 25,
        //     WithPaginationInfo=true,
        //     Details = true
        //    };

        //var controller = GetController();
        //    var result = await controller.FindQuoteDetails(detailsInput).ConfigureAwait(false);

        //    result.Should().NotBeNull();
        //}

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
                ConfigIdFilter = "123",
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