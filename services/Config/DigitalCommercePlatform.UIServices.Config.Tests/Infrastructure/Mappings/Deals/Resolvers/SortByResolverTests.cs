//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals.Resolvers;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Infrastructure.Mappings.Deals.Resolvers
{
    public class SortByResolverTests
    {
        private readonly IMapper _mapper;
        private readonly Models.Deals.FindModel _source;


        public SortByResolverTests()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<DealProfile>());
            _mapper = config.CreateMapper();

            _source = new Models.Deals.FindModel();
        }

        [Theory]
        [AutoDomainData]
        public void ShouldReturnTrue(Models.Deals.FindModel source)
        {
            source.SortDirection = SortDirection.asc;
            var result = _mapper.Map<Models.Deals.Internal.FindModel>(source);

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
            var result = _mapper.Map<Models.Deals.Internal.FindModel>(_source);

            result.SortByAscending.Should().BeFalse();
        }

        [Fact]
        public void NullSourceShouldReturnFalse()
        {
            var result = new SortByResolver().Resolve(null, new Models.Deals.Internal.FindModel(), false, null);

            result.Should().BeFalse();
        }
    }
}
