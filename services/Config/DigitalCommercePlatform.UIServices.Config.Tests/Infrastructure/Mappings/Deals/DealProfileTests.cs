//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals.Fixtures;
using FluentAssertions;
using System;
using Xunit;

using AGRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

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

        [Theory]
        [ClassData(typeof(MappingPaginatedToInternalFindModelData))]
        public void MappingPaginatedToInternalFindModelShouldBeValid(Paginated paginated)
        {
            var result = Mapper.Map<Models.Deals.Internal.FindModel>(paginated);

            result.Page.Should().Be(paginated.PageNumber);
            result.PageSize.Should().Be(paginated.PageSize);
        }

        internal class MappingFindModelToInternalFindModelData : TheoryData<AGRD.GetDeals.Request>
        {
            public MappingFindModelToInternalFindModelData()
            {
                AddRow(new AGRD.GetDeals.Request
                {
                    ValidFrom = DateTime.UtcNow,
                    ValidTo = DateTime.UtcNow.AddDays(1),
                    EndUserName = "endusername1",
                    UpdatedFrom = DateTime.UtcNow.AddDays(2),
                    UpdatedTo = DateTime.UtcNow.AddDays(3),
                    VendorName = "vendorname1",
                    PageNumber = 2,
                    PageSize = 20,
                    SortDirection = SortDirection.asc,
                });
            }
        }

        [Theory]
        [ClassData(typeof(MappingFindModelToInternalFindModelData))]
        public void MappingFindModelToInternalFindModelShouldBeValid(AGRD.GetDeals.Request model)
        {
            var result = Mapper.Map<AGRD.GetDeals.Request>(model);

            result.PageNumber.Should().Be(model.PageNumber);
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
