using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Configurations.Fixtures;
using FluentAssertions;
using System;
using Xunit;

using DCPC = DigitalCommercePlatform.UIServices.Config.Models.Configurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Configurations
{
    public class ConfigurationProfileTests : IClassFixture<InitConfigurationProfileFixture>
    {
        public InitConfigurationProfileFixture Fixture;
        public IMapper Mapper;

        public ConfigurationProfileTests(InitConfigurationProfileFixture fixture)
        {
            Fixture = fixture;
            Mapper = Fixture.Config.CreateMapper();
        }

        [Fact]
        public void ConfigurationProfileConfigurationShouldBeValid()
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
            var result = Mapper.Map<DCPC.Internal.FindModel>(paginated);

            result.Page.Should().Be(paginated.PageNumber);
            result.PageSize.Should().Be(paginated.PageSize);
        }

        internal class MappingFindModelToInternalFindModelData : TheoryData<DCPC.FindModel>
        {
            public MappingFindModelToInternalFindModelData()
            {
                AddRow(new DCPC.FindModel
                {
                    CreatedFrom = DateTime.UtcNow,
                    CreatedTo = DateTime.UtcNow.AddDays(1),
                    Details = true,
                    EndUser = "enduser1",
                    Id = "id1",
                    Manufacturer = "manufacturer1",
                    PageNumber = 2,
                    PageSize = 20,
                    ResellerId = "resellerId1",
                    ResellerName = "resellerName1",
                    SortBy = "any",
                    SortDirection = SortDirection.asc,
                    Type = "type1"
                });
            }
        }

        [Theory]
        [ClassData(typeof(MappingFindModelToInternalFindModelData))]
        public void MappingFindModelToInternalFindModelShouldBeValid(DCPC.FindModel model)
        {
            var result = Mapper.Map<DCPC.Internal.FindModel>(model);

            result.CreatedFrom.Should().Be(model.CreatedFrom);
            result.CreatedTo.Should().Be(model.CreatedTo);
            result.Details.Should().Be(model.Details);
            result.EndUser.Should().Be(model.EndUser);
            result.Id.Should().Be(model.Id);
            result.Manufacturer.Should().Be(model.Manufacturer);
            result.Page.Should().Be(model.PageNumber);
            result.PageSize.Should().Be(model.PageSize);
            result.ResellerId.Should().Be(model.ResellerId);
            result.ResellerName.Should().Be(model.ResellerName);
            result.SortBy.Should().Be(model.SortBy);
            result.SortByAscending.Should().BeTrue();
            result.Type.Should().Be(model.Type);
        }

    }
}