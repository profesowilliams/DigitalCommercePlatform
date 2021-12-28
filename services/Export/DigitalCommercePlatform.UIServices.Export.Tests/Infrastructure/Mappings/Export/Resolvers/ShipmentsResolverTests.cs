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
    public class ShipmentsResolverTests {
        
        private readonly ShipmentsResolver _resolver;

        public ShipmentsResolverTests()
        {
            _resolver = new ();
        }

        internal class ResolveShouldReturnEmptyListData : TheoryData<Item>
        {
            public ResolveShouldReturnEmptyListData()
            {
                Add(new Item() { Shipments = null });
                Add(new Item() { Shipments = new List<ShipmentModel>() });
            }
        }

        [Theory]
        [ClassData(typeof(ResolveShouldReturnEmptyListData))]
        public void ResolveShouldReturnEmptyTrackingDetailsList(Item source)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeEmpty();
            result.Should().BeOfType(typeof(List<TrackingDetails>));
        }

        [Theory]
        [AutoDomainData]
        public void ResolveShouldReturnTrackingDetailsList(Item source)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType(typeof(List<TrackingDetails>));
            result.Should().NotBeEmpty();
            result.Count.Should().Be(source.Shipments.Count);
        }
    }
}
