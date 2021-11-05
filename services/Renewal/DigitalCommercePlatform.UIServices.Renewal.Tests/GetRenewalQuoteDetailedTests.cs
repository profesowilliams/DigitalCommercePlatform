//2021 (c) Tech Data Corporation -. All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.AutoMapper;
using System.Threading.Tasks;
using Moq;
using Microsoft.Extensions.Logging;
using static DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals.GetRenewalQuoteDetailed;
using Xunit;
using DigitalFoundation.Common.TestUtilities;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using System.Threading;
using FluentAssertions;
using FluentAssertions.Collections;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using System;

namespace DigitalCommercePlatform.UIServices.Renewal.Tests
{
    public class GetRenewalQuoteDetailedTests
    {
        private static IMapper Mapper => new MapperConfiguration(config => config.AddProfile(new RenewalsMapper())).CreateMapper();
        private static Mock<ILogger<GetRenewalQuoteDetailedHandler>> Logger => new();

        [Theory]
        [AutoDomainData]
        public async Task OnHandle_ReturnsNull_NullExpected(Request request)
        {
            // arrange
            var coreQuoteClient = new Mock<IRenewalService>();
            var handler = new GetRenewalQuoteDetailedHandler(coreQuoteClient.Object, Mapper, Logger.Object);

            // act
            var result = await handler.Handle(request, new CancellationToken());

            // assert
            result.Content.Details.Should().BeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task OnHandle_ReturnsData_ExpectedCountAndData(Request request, List<DetailedModel> returnedData)
        {
            // arrange
            var coreQuoteClient = new Mock<IRenewalService>();
            coreQuoteClient.Setup(x => x.GetRenewalsQuoteDetailedFor(It.IsAny<Request>()))
                .ReturnsAsync(returnedData);
            var handler = new GetRenewalQuoteDetailedHandler(coreQuoteClient.Object, Mapper, Logger.Object);

            // act
            var result = await handler.Handle(request, new CancellationToken());

            // assert
            result.Should().NotBeNull();
            result.Content.Details.Count.Should().Be(3);
            result.Content.Details[0].Source.Id.Should().Be(returnedData[0].Source.Id);
            result.Content.Details[0].Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public void GetRenewalQuoteDetailed_NullRequest_ThrowsNullReferenceException(List<DetailedModel> returnedData)
        {
            // arrange
            var coreQuoteClient = new Mock<IRenewalService>();
            coreQuoteClient.Setup(x => x.GetRenewalsQuoteDetailedFor(It.IsAny<Request>()))
                .ReturnsAsync(returnedData);
            var handler = new GetRenewalQuoteDetailedHandler(coreQuoteClient.Object, Mapper, Logger.Object);

            // act - assert
            Assert.ThrowsAsync<NullReferenceException>(() => handler.Handle(null, new CancellationToken()));
        }
    }
}