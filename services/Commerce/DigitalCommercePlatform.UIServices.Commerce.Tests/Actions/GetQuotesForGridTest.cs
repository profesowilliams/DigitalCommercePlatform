//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Find;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions
{
    public class GetQuotesForGridTest
    {
        private readonly Mock<ICommerceService> _mockCommerceService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<ILogger<GetQuotesForGrid.Handler>> _logger;
        private readonly Mock<IAppSettings> _mockAppSettings;


        public GetQuotesForGridTest()
        {
            _mockCommerceService = new();
            _mapper = new Mock<IMapper>();
            _logger = new Mock<ILogger<GetQuotesForGrid.Handler>>();
            _mockAppSettings = new Mock<IAppSettings>();
            _mockAppSettings.Setup(x => x.GetSetting("Feature.UI.QuoteDeals.ReturnDummyRecords")).Returns("true");
        }

        GetQuotesForGrid.Request RequestInput = new GetQuotesForGrid.Request
        {
            CreatedBy = "Nilesh",
            QuoteIdFilter = "17645",
            VendorReference = "Cisco",
            CreatedFrom = DateTime.Now,
            CreatedTo = DateTime.Now,
            SortBy = "QuoteId",
            SortDirection = "desc",
            PageSize = 25,
            PageNumber = 1,
            WithPaginationInfo = true,
            Manufacturer = "Cisco",
            EndUserName = "PUBLICX",
            Details = true,
            DealId = "54789",
            LatestRevisionOnly = Models.Quote.Find.LatestRevisionOnly.Y
        };


        [Theory]
        [AutoDomainData]
        public async Task GetQuoteDetails(FindResponse<IEnumerable<QuoteModel>> expected)
        {

            _mockCommerceService.Setup(x => x.FindQuotes(
                       It.IsAny<FindModel>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetQuotesForGrid.Handler(_mockCommerceService.Object, _mapper.Object, _logger.Object, _mockAppSettings.Object);
            var result = await handler.Handle(RequestInput, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}