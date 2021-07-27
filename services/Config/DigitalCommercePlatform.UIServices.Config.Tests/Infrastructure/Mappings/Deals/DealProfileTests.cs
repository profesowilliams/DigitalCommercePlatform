using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using FluentAssertions;
using System;
using Xunit;

using DCPD = DigitalCommercePlatform.UIServices.Config.Models.Deals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals
{
    public class InitDealProfileFixture
    {
        public MapperConfiguration Config { get; }

        public InitDealProfileFixture()
        {
            Config = new MapperConfiguration(cfg => cfg.AddProfile<DealProfile>());
        }
    }

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
            var result = Mapper.Map<DCPD.Internal.FindModel>(paginated);

            result.Page.Should().Be(paginated.PageNumber);
            result.PageSize.Should().Be(paginated.PageSize);
        }

        internal class MappingFindModelToInternalFindModelData : TheoryData<DCPD.FindModel>
        {
            public MappingFindModelToInternalFindModelData()
            {
                AddRow(new DCPD.FindModel
                {
                    CreatedFrom = DateTime.UtcNow,
                    CreatedTo = DateTime.UtcNow.AddDays(1),
                    DealId = "dealid1",
                    EndUserName = "endusername1",
                    ExpiresFrom = DateTime.UtcNow.AddDays(2),
                    ExpiresTo = DateTime.UtcNow.AddDays(3),
                    Market = "market1",
                    Pricing = DCPD.PricingCondition.EducationK12,
                    VendorBid = "vendorbid1",
                    VendorName = "vendorname1",
                    PageNumber = 2,
                    PageSize = 20,
                    SortBy = "any",
                    SortDirection = SortDirection.asc,
                });
            }
        }

        [Theory]
        [ClassData(typeof(MappingFindModelToInternalFindModelData))]
        public void MappingFindModelToInternalFindModelShouldBeValid(DCPD.FindModel model)
        {
            var result = Mapper.Map<DCPD.Internal.FindModel>(model);

            result.CreatedFrom.Should().Be(model.CreatedFrom);
            result.CreatedTo.Should().Be(model.CreatedTo);
            result.DealId.Should().Be(model.DealId);
            result.EndUserName.Should().Be(model.EndUserName);
            result.ExpiresFrom.Should().Be(model.ExpiresFrom);
            result.ExpiresTo.Should().Be(model.ExpiresTo);
            result.Market.Should().Be(model.Market);
            result.Pricing.Should().Be(model.Pricing);
            result.VendorBid.Should().Be(model.VendorBid);
            result.VendorName.Should().Be(model.VendorName);
            result.Page.Should().Be(model.PageNumber);
            result.PageSize.Should().Be(model.PageSize);
            result.SortBy.Should().Be(model.SortBy);
            result.SortByAscending.Should().BeTrue();
        }
    }
}
