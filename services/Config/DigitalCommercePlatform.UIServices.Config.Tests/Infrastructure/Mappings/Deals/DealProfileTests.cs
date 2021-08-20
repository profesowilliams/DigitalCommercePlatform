using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals.Fixtures;
using FluentAssertions;
using System;
using Xunit;

using DCPD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals
{
    public class DealProfileTests : IClassFixture<InitDealProfileFixture>
    {
        public InitDealProfileFixture Fixture;
        public IMapper Mapper;

        public DealProfileTests(InitDealProfileFixture fixture)
        {
            Fixture = fixture;
            Mapper = Fixture.Config.CreateMapper();
        }

        [Fact]
        public void DealProfileConfigurationShouldBeValid()
        {
            Fixture.Config.AssertConfigurationIsValid();
        }

        internal class MappingPaginatedToInternalFindModelData : TheoryData<Paginated>
        {
            public MappingPaginatedToInternalFindModelData()
            {
                AddRow(new Paginated { PageNumber = 2, PageSize = 3 });
                AddRow(new Paginated { PageNumber = 1, PageSize = 100 });
            }
        }

        internal class MappingFindModelToInternalFindModelData : TheoryData<DCPD.GetDeals.Request>
        {
            public MappingFindModelToInternalFindModelData()
            {
                AddRow(new DCPD.GetDeals.Request
                {
                    ValidFrom = DateTime.UtcNow,
                    ValidTo = DateTime.UtcNow.AddDays(1),
                    EndUserName = "endusername1",
                    UpdatedFrom = DateTime.UtcNow.AddDays(2),
                    UpdatedTo = DateTime.UtcNow.AddDays(3),
                    VendorName = "vendorname1",
                    Page = 2,
                    PageSize = 20,
                    SortDirection = SortDirection.asc,
                });
            }
        }

        [Theory]
        [ClassData(typeof(MappingFindModelToInternalFindModelData))]
        public void MappingFindModelToInternalFindModelShouldBeValid(DCPD.GetDeals.Request model)
        {
            var result = Mapper.Map<DCPD.GetDeals.Request>(model);

            result.Page.Should().Be(model.Page);
            result.ValidFrom.Should().Be(model.ValidFrom);
            result.ValidTo.Should().Be(model.ValidTo);
            result.EndUserName.Should().Be(model.EndUserName);
            result.UpdatedTo.Should().Be(model.UpdatedTo);
            result.UpdatedFrom.Should().Be(model.UpdatedFrom);
            result.Pricing.Should().Be(model.Pricing);
            result.VendorName.Should().Be(model.VendorName);
            result.PageSize.Should().Be(model.PageSize);
            result.SortDirection.Should().Be(model.SortDirection);
        }
    }
}
