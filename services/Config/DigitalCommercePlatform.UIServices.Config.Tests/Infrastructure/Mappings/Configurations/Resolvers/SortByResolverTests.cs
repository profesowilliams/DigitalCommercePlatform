//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations.Resolvers;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

using Internal = DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Configurations.Resolvers
{
    public class SortByResolverTests
    {
        private readonly IMapper _mapper;
        private readonly FindModel _source;


        public SortByResolverTests()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ConfigurationProfile>());
            _mapper = config.CreateMapper();

            _source = new FindModel();
        }

        [Theory]
        [AutoDomainData]
        public void ShouldReturnTrue(FindModel source)
        {
            source.SortDirection = SortDirection.asc;
            var result = _mapper.Map<Internal.FindModel>(source);

            result.SortByAscending.Should().BeTrue();
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("   ")]
        [InlineData("x")]
        [InlineData("12")]
        [InlineData("desc")]
        public void ShouldReturnFalse(string s)
        {
            Enum.TryParse(s, out SortDirection parsingResult);
            _source.SortDirection = parsingResult;
            var result = _mapper.Map<Internal.FindModel>(_source);

            result.SortByAscending.Should().BeFalse();
        }

        [Fact]
        public void NullSourceShouldReturnFalse()
        {
            var result = new SortByResolver().Resolve(null, new Internal.FindModel(), false, null);

            result.Should().BeFalse();
        }
    }
}
