//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
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
    public class SearchDetailedTests
    {
        private static IMapper Mapper => new MapperConfiguration(config => config.AddProfile(new RenewalsRequestMapper())).CreateMapper();
        private static Mock<ILogger<SearchRenewalDetailed.GetRenewalsHandler>> Logger => new();

        [Theory]
        [AutoDomainData]
        public async Task SearchDetailedHandler_Handle_ReturnDataAndPaginationInfo(SearchRenewalDetailed.Request request, List<DetailedModel> dtos)
        {
            // arrange
            request.WithPaginationInfo = true;
            var _service = new Mock<IRenewalService>();
            _service.Setup(x => x.GetRenewalsDetailedFor(It.IsAny<SearchRenewalDetailed.Request>())).ReturnsAsync(dtos);

            var handler = new SearchRenewalDetailed.GetRenewalsHandler(_service.Object, Mapper, Logger.Object);
            // act
            var result = await handler.Handle(request, new CancellationToken());

            // assert
            result.Should().NotBeNull();
        }
    }
}
