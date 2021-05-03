using DigitalCommercePlatform.UIServices.Account.Services;
using Moq;
using System;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class RenewalsSummaryServiceTests
    {
        [Fact(DisplayName = "Summaries are grouped in four time intervals")]
        public void SummariesAreGroupedInFourTimeIntervals()
        {
            var sut = new RenewalsSummaryService(CreateTimeProviderMock());

            var renewalsSummaryModel = sut.GetSummaryItemsFrom(new List<string>());

            Assert.Equal(4, renewalsSummaryModel.Count);
        }

        [Fact(DisplayName = "Summaries time intervals are labeled correctly")]
        public void SummariesTimeIntervalsAreLabeledCorrectly()
        {
            var sut = new RenewalsSummaryService(CreateTimeProviderMock());

            var renewalsSummaryModel = sut.GetSummaryItemsFrom(new List<string>());

            Assert.Equal("1", renewalsSummaryModel[0].Days);
            Assert.Equal("30", renewalsSummaryModel[1].Days);
            Assert.Equal("60", renewalsSummaryModel[2].Days);
            Assert.Equal("90", renewalsSummaryModel[3].Days);
        }

        [Fact(DisplayName = "Summaries values are calculated correctly")]
        public void SummariesValuesAreCalculatedCorrectly()
        {
            var renewalsExpirationDates = new List<string>()
            {
                new DateTime(2021,4,10).ToString(),
                new DateTime(2021,4,11).ToString(), // 2 in april
                new DateTime(2021,5,11).ToString(),
                new DateTime(2021,5,12).ToString(),
                new DateTime(2021,5,13).ToString(), // 3 in May
                new DateTime(2021,6,11).ToString(),
                new DateTime(2021,6,12).ToString(),
                new DateTime(2021,6,13).ToString(),
                new DateTime(2021,6,14).ToString(), //  4 in June
                new DateTime(2021,7,13).ToString()  // 1 in July 
            };

            var sut = new RenewalsSummaryService(CreateTimeProviderMock());

            var renewalsSummaryModel = sut.GetSummaryItemsFrom(renewalsExpirationDates);

            Assert.Equal(2, renewalsSummaryModel[0].Value);
            Assert.Equal(3, renewalsSummaryModel[1].Value);
            Assert.Equal(4, renewalsSummaryModel[2].Value);
            Assert.Equal(1, renewalsSummaryModel[3].Value);
        }


        private static ITimeProvider CreateTimeProviderMock()
        {
            var timeProviderMock = new Mock<ITimeProvider>();
            timeProviderMock.Setup(p => p.Today).Returns(new DateTime(2021,5,3));
            return timeProviderMock.Object;
        }
    }
}
