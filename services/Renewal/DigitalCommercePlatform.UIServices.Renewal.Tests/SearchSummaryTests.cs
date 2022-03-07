//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Features.Cache;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Renewal.Tests
{
    public class SearchSummaryTests
    {
        private static Mock<IUIContext> Context => new();
        private static Mock<ISessionIdBasedCacheProvider> Provider => new();
        private static Mock<IAppSettings> AppSettings
        {
            get
            {
                var moq = new Mock<IAppSettings>();

                moq.Setup(x => x.GetSetting("RenewalsUI.HouseAccount")).Returns("http://appConfigUrl/v1/");
                moq.Setup(x => x.GetSetting("Cache.DefaultExpirationTimeInSec")).Returns("120");

                return moq;
            }
        }

        [Theory]
        [AutoDomainData]
        public async Task SearchSummaryHandler_Handle_ReturnDataAndPaginationInfo(SearchRenewalSummary.Request request, SummaryResponseModel dtos)
        {
            // arrange
            request.WithPaginationInfo = true;

            var _service = new Mock<IRenewalService>();

            _service.Setup(x => x.GetRenewalsSummaryFor(It.IsAny<SearchRenewalSummary.Request>())).ReturnsAsync(dtos);

            var handler = new SearchRenewalSummary.GetRenewalsHandler(_service.Object, Context.Object, Provider.Object, AppSettings.Object);
            // act
            var result = await handler.Handle(request, new CancellationToken());

            // assert
            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public void SearchSummaryHandler_Handle_ThrowException(SearchRenewalSummary.Request request)
        {
            // arrange
            var _service = new Mock<IRenewalService>();

            _service.Setup(x => x.GetRenewalsSummaryFor(It.IsAny<SearchRenewalSummary.Request>())).Throws(new Exception("test"));

            var handler = new SearchRenewalSummary.GetRenewalsHandler(_service.Object, Context.Object, Provider.Object, AppSettings.Object);

            // act
            Func<Task> act = async () => { await handler.Handle(request, new CancellationToken()).ConfigureAwait(false); };

            //assert
            act.Should().ThrowAsync<Exception>();
        }
    }
}
