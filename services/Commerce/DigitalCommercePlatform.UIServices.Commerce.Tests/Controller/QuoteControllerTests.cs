using AutoFixture.Xunit2;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderQoute;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuoteDetails;
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetQuotes;
using DigitalCommercePlatform.UIServices.Commerce.Controllers;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System;
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
        private readonly Mock<IOptions<AppSettings>> _optionsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public QuoteControllerTests()
        {
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };
            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);
            _context = new Mock<IUIContext>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<QuoteController>>();
            _optionsMock = new Mock<IOptions<AppSettings>>();
            _optionsMock.Setup(s => s.Value).Returns(appSettings);
            _siteSettings = new Mock<ISiteSettings>();
        }

        private QuoteController GetController()
        {
            return new QuoteController(_mediator.Object, _optionsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }

        [Fact]
        public void GetQuote()
        {

            //_mediator.Setup(x => x.Send(
            //           It.IsAny<GetQuote.Request>(),
            //           It.IsAny<CancellationToken>()))
            //       .ReturnsAsync(expected);

            var controller = GetController();

            var result = controller.GetQuote("645665656565");

            result.Should().NotBeNull();
        }



        [Theory]
        [AutoDomainData]
        public async Task GetCartDetailsInQuote(ResponseBase<DetailsOfSavedCartsQuote.Response> expected)
        {

            _mediator.Setup(x => x.Send(
                      It.IsAny<DetailsOfSavedCartsQuote.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.GetCartDetailsInQuote("1234").ConfigureAwait(false);

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
        public async Task FindQuoteDetails(ResponseBase<FindQuotesForGrid.Response> expected)
        {
            _mediator.Setup(x => x.Send(
                       It.IsAny<FindQuotesForGrid.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var detailsInput = new FindModel()
            {
             Id = "123",
             CustomerName=  "123",
             CustomerNumber="123",
             Active = "123",
             CreatedBy = "123",
             SalesTeamId = "123",
             SalesTeamName = "123",
             SalesAreaName = "123",
             SuperSalesAreaName = "123",
             QuoteType = "123",
             Manufacturer = "123",
             OrderId = "123",
             Material = "123",
             ManufacturerPart = "123",
             CustomerPart = "123",
             ShipToName = "123",
             EndUserName = "123",
             CustomerPO = "123",
             EndUserPO = "123",
             RevenueMaxThreshold =101,
             RevenueMinThreshold = 101,
             TDUAN = "123",
             VendorAgreement = "123",
             WorkflowId = "123",
             SalesOrg = "123",
             AccountOwner = "123",
             DirectorId = "123",
             DirectorName = "123",
             BusinessManagerId = "123",
             BusinessManagerName = "123",
             DivisionManagerId = "123",
             DivisionManagerName = "123",
             VendorSalesAssociate = "123",
             VendorSalesRep = "123",
             Description ="123",
             SortBy ="123",
             SortAscending =true,
             Page  = 1,
             PageSize  = 25,
             WithPaginationInfo=true,
             Details = true
            };


        var controller = GetController();
            var result = await controller.FindQuoteDetails(detailsInput).ConfigureAwait(false);

            result.Should().NotBeNull();
        }
    }
}
