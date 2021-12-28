//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export.Resolvers
{
    public class DateResolverTests
    {
        private readonly DateResolver _resolver;

        public DateResolverTests()
        {
            _resolver = new ();
        }

        [Theory]
        [AutoDomainData]
        public void ResolveShouldReturnEmptyString(OrderModel source)
        {
            source.PoDate = null;
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeEmpty();
        }

        [Theory]
        [AutoDomainData]
        public void ResolveShouldReturnDateString(OrderModel source)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().NotBeEmpty();
        }
    }
}
