//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Renewal.Tests
{
    public class ServiceTests
    {
        private static IMapper Mapper => new MapperConfiguration(config => config.AddProfile(new RenewalsMapper())).CreateMapper();
        private static Mock<ILogger<RenewalService>> Logger => new();
        private static Mock<IAppSettings> AppSettings
        {
            get
            {
                var moq = new Mock<IAppSettings>();

                moq.Setup(x => x.GetSetting("App.Renewal.Url"))
                    .Returns("http://appConfigUrl/v1/");
                moq.Setup(x => x.GetSetting("App.Quote.Url"))
                   .Returns("http://appquoteUrl/v1/");

                return moq;
            }
        }
        private static Mock<IUIContext> Context => new();

        public ServiceTests()
        {

        }
        [Theory]
        [AutoDomainData]
        public void ServicesGetCountTests(RefinementRequest request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null)).ReturnsAsync(returnedData);
            var refinementRequest = new Mock<RefinementRequest>();
            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Context.Object, Mapper);
            var result = service.GetRenewalsSummaryCountFor(request).Result;
            result.Should().Be(2);

        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetDetailedReturnNotNullTests(SearchRenewalDetailed.Request request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            httpClient.Setup(x => x.GetAsync<ResponseDetailedDto>(It.IsAny<string>(), null, null)).ReturnsAsync(returnedDetailedData);
            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Context.Object, Mapper);
            var result = service.GetRenewalsDetailedFor(request).Result;
            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetSummaryReturnNotNullTests(SearchRenewalSummary.Request request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null)).ReturnsAsync(returnedSummaryData);
            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Context.Object, Mapper);
            var result = service.GetRenewalsSummaryFor(request).Result;
            result.Should().NotBeNull();
            
        }

        [Theory]
        [AutoDomainData]
        public void ThrowsExceptionOtherThanRemoteServerHttpException(SearchRenewalSummary.Request request)
        {
            //arrange
            
            var httpClient = new Mock<IMiddleTierHttpClient>();
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new Exception("test 123"));

            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Context.Object, Mapper);
            //act
            Func<Task> act = async () => await service.GetRenewalsSummaryFor(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            httpClient.Verify(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        private ResponseSummaryDto returnedSummaryData()
        {
            return new ResponseSummaryDto
            {
                Count = 5,
                Data = new List<SummaryDto>() { new SummaryDto
            {
                EndUserPO = "Test 2222"
            } }
            };
        }

        private ResponseDetailedDto returnedDetailedData()
        {
            return new ResponseDetailedDto { Count = 2, Data = new List<DetailedDto>() };
        }

        [Theory]
        [AutoDomainData]
        public void ServicesGetRefainmentGroupTests(RefinementRequest request)
        {
            var httpClient = new Mock<IMiddleTierHttpClient>();
            httpClient.Setup(x => x.GetAsync<ResponseSummaryDto>(It.IsAny<string>(), null, null)).ReturnsAsync(returnedData);
            var refinementRequest = new Mock<RefinementRequest>();
            var service = new RenewalService(httpClient.Object, Logger.Object, AppSettings.Object, Context.Object, Mapper);
            var result = service.GetRefainmentGroup(request).Result;
            result.Should().NotBeNull();
            result.Group.Should().Be("RenewalAttributes");
            result.Refinements.Should().NotBeEmpty();
            result.Refinements.Count.Should().Be(3);
           
        }

        private ResponseSummaryDto returnedData()
        {
            return new ResponseSummaryDto() { Count = 2, Data = new List<SummaryDto>() };
        }
    }
}
