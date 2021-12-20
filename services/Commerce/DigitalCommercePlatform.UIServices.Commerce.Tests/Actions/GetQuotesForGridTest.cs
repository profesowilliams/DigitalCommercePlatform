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

        public class RequestInput
        {
            public string CreatedBy { get; private set; }
            public string QuoteIdFilter { get; private set; }
            public string VendorReference { get; private set; }
            public DateTime? CreatedFrom { get; private set; }
            public DateTime? CreatedTo { get; private set; }
            public string SortBy { get; private set; }
            public string SortDirection { get; private set; }
            public int? PageSize { get; private set; } = 25;
            public int? PageNumber { get; private set; } = 1;
            public bool? WithPaginationInfo { get; private set; } = true;
            public string Manufacturer { get; private set; }
            public string EndUserName { get; private set; }
            public bool Details { get; private set; } = true;
            public string DealId { get; private set; }
        }

        [Theory]
        [AutoDomainData]
        public async Task GetQuoteDetails(FindResponse<IEnumerable<QuoteModel>> expected)
        {

            _mockCommerceService.Setup(x => x.FindQuotes(
                       It.IsAny<FindModel>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetQuotesForGrid.Handler(_mockCommerceService.Object, _mapper.Object, _logger.Object, _mockAppSettings.Object);
            var request = new GetQuotesForGrid.Request();
            var result = await handler.Handle(request, It.IsAny<CancellationToken>());
            result.Should().NotBeNull();
        }
    }
}
