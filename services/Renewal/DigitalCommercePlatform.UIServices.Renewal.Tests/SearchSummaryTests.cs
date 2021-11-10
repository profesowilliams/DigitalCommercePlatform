//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Renewal.Tests
{
    public class SearchSummaryTests
    {
        private static IMapper Mapper => new MapperConfiguration(config => config.AddProfile(new RenewalsRequestMapper())).CreateMapper();
        private static Mock<ILogger<SearchRenewalSummary.GetRenewalsHandler>> Logger => new();
        private static Mock<IUIContext> Context => new();
        private static Mock<ISessionIdBasedCacheProvider> Provider => new();

        [Theory]
        [AutoDomainData]
        public async Task SearchSummaryHandler_Handle_ReturnDataAndPaginationInfo(SearchRenewalSummary.Request request, List<SummaryModel> dtos)
        {
            // arrange
            request.WithPaginationInfo = true;
            var _service = new Mock<IRenewalService>();
            _service.Setup(x => x.GetRenewalsSummaryFor(It.IsAny<SearchRenewalSummary.Request>())).ReturnsAsync(dtos);

            var handler = new SearchRenewalSummary.GetRenewalsHandler(_service.Object, Mapper, Logger.Object, Context.Object, Provider.Object);
            // act
            var result = await handler.Handle(request, new CancellationToken());

            // assert
            result.Should().NotBeNull();
        }
    }
}
