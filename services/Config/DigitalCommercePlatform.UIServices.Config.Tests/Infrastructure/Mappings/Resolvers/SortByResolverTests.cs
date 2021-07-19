using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Resolvers
{
    public class SortByResolverTests
    {
        private readonly IMapper _mapper;
        private readonly Models.Configurations.FindModel _source;


        public SortByResolverTests()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ConfigurationProfile>());
            _mapper = config.CreateMapper();

            _source = new Models.Configurations.FindModel();
        }

        [Theory]
        [AutoDomainData]
        public void ShouldReturTrue(Models.Configurations.FindModel source)
        {
            source.SortDirection = Models.Common.SortDirection.asc;
            var result = _mapper.Map<Models.Configurations.Internal.FindModel>(source);

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
        public void ShouldReturFalse(string s)
        {
            Enum.TryParse(s, out SortDirection parsingResult);
            _source.SortDirection = parsingResult;
            var result = _mapper.Map<Models.Configurations.Internal.FindModel>(_source);

            result.SortByAscending.Should().BeFalse();
        }
    }
}
