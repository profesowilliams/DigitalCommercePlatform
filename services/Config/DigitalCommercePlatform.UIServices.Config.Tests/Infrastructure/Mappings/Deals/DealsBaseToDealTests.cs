//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals.Fixtures;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals
{
    public class DealsBaseToDealTests : IClassFixture<InitDealProfileFixture>
    {
        public InitDealProfileFixture Fixture;
        public IMapper Mapper;

        public DealsBaseToDealTests(InitDealProfileFixture fixture)
        {
            Fixture = fixture;
            Mapper = Fixture.Config.CreateMapper();
        }

        [Theory]
        [AutoDomainData]
        public void MappingDealsBaseToDealShouldBeValid(DealsBase dealsBase)
        {
            dealsBase.ExpirationDate = null;
            var result = Mapper.Map<Deal>(dealsBase);

            result.DealId.Should().Be(dealsBase.Source.Id);
            result.Description.Should().Be(dealsBase.Description);
            result.EndUserName.Should().Be(dealsBase.EndUserName);
            result.ExpiresOn.Should().Be(DateTimeToStringConverter.DefaultDateTimeString);
            result.Quotes.Should().BeEquivalentTo(dealsBase.Quotes);
            result.Vendor.Should().Be(dealsBase.VendorName);
        }

        [Fact]
        public void MappingNullExpirationDateShouldBeValid()
        {
            DealsBase dto = new() { ExpirationDate = null };
            var result = Mapper.Map<Deal>(dto);
            result.ExpiresOn.Should().Be(DateTimeToStringConverter.DefaultDateTimeString);
        }

        internal class MappingExpiresOnData : TheoryData<DateTime>
        {
            public MappingExpiresOnData()
            {
                Add(new DateTime(2021, 12, 31, 13, 59, 0, 999));
            }
        }

        [Theory]
        [ClassData(typeof(MappingExpiresOnData))]
        public void MappingExpirationDateShouldBeValid(DateTime dt)
        {
            DealsBase dto = new() { ExpirationDate = dt };
            var expected = dt.ToString(DateTimeToStringConverter.Format);

            var result = Mapper.Map<Deal>(dto);

            result.ExpiresOn.Should().Be(expected);
        }
    }
}
