//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;
using DigitalCommercePlatform.UIServices.Export.Models.Order;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export.Resolvers
{
    public class LineTrackingsResolverTests
    {
        private readonly LineTrackingsResolver _resolver;

        public LineTrackingsResolverTests()
        {
            _resolver = new();
        }

        [Theory]
        [AutoDomainData]
        public void ResolveShouldReturnNotEmptyList(Item source)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType<List<TrackingDetails>>();
            result.Count.Should().Be(source.Shipments.Count);
        }

        [Theory]
        [AutoDomainData]
        public void ResolveShouldReturnEmptyList(Item source)
        {
            source.Shipments = new ();
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType<List<TrackingDetails>>();
            result.Count.Should().Be(0);
        }

        [Fact]
        public void ResolveShouldReturnNull()
        {
            var result = _resolver.Resolve(null, null, null, null);

            result.Should().BeNull();
        }
    }
}
