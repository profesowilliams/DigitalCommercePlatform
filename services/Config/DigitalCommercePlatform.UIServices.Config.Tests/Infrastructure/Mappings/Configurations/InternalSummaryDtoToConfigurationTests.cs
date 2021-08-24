//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Configurations.Fixtures;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Configurations
{
    public class InternalSummaryDtoToConfigurationTests : IClassFixture<InitConfigurationProfileFixture>
    {
        public InitConfigurationProfileFixture Fixture;
        public IMapper Mapper;

        public InternalSummaryDtoToConfigurationTests(InitConfigurationProfileFixture fixture)
        {
            Fixture = fixture;
            Mapper = Fixture.Config.CreateMapper();
        }

        [Theory]
        [AutoDomainData]
        public void MappingInternalSummaryDtoToConfigurationShouldBeValid(SummaryDto dto)
        {
            dto.Created = null;
            dto.ExpiryDate = null;
            var result = Mapper.Map<Configuration>(dto);

            result.ConfigId.Should().Be(dto.Source.Id);
            result.ConfigurationType.Should().Be(dto.Source.Type);
            result.Created.Should().Be(DateTimeToStringConverter.DefaultDateTimeString);
            result.Expires.Should().Be(DateTimeToStringConverter.DefaultDateTimeString);
            result.Vendor.Should().Be(dto.Vendor.Name);
            result.ConfigName.Should().Be(dto.Name);
            result.EndUserName.Should().Be(dto.EndUser.Name);
        }

        [Fact]
        public void MappingNullCreatedShouldBeValid()
        {
            SummaryDto dto = new() { Created = null };
            var result = Mapper.Map<Configuration>(dto);
            result.Created.Should().Be(DateTimeToStringConverter.DefaultDateTimeString);
        }

        internal class MappingCreatedExpiresData : TheoryData<DateTime>
        {
            public MappingCreatedExpiresData()
            {
                Add(new DateTime(2021, 12, 31, 13, 59, 0, 999));
            }
        }

        [Theory]
        [ClassData(typeof(MappingCreatedExpiresData))]
        public void MappingCreatedShouldBeValid(DateTime dt)
        {
            SummaryDto dto = new() { Created = dt };
            var expected = dt.ToString(DateTimeToStringConverter.Format);

            var result = Mapper.Map<Configuration>(dto);

            result.Created.Should().Be(expected);
        }

        [Theory]
        [ClassData(typeof(MappingCreatedExpiresData))]
        public void MappingExpiresShouldBeValid(DateTime dt)
        {
            SummaryDto dto = new() { ExpiryDate = dt };
            var expected = dt.ToString(DateTimeToStringConverter.Format);

            var result = Mapper.Map<Configuration>(dto);

            result.Expires.Should().Be(expected);
        }
    }
}
