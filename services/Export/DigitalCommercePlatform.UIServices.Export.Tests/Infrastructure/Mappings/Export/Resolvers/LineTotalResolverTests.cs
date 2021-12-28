//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using FluentAssertions;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export.Resolvers
{
    public class LineTotalResolverTests 
    {
        private readonly LineTotalResolver _resolver;

        public LineTotalResolverTests()
        {
            _resolver = new();
        }

        [Fact]
        public void ResolveShouldReturnCalculatedResult()
        {
            Item source = new();
            source.UnitPrice = (decimal)5.5;
            source.Quantity = 11;
            decimal expected = (decimal)60.5;
            source.TotalPrice = null;
            
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().Be(expected);
        }

        internal class ResolveShouldReturnTotalPriceData : TheoryData<decimal?, decimal?>
        {
            public ResolveShouldReturnTotalPriceData()
            {
                Add(null, null);
                Add(2.5m, null);
                Add(4.5m, 5.5m);
            }
        }

        [Theory]
        [ClassData(typeof(ResolveShouldReturnTotalPriceData))]
        public void ResolveShouldReturnTotalPrice(decimal? totalPrice, decimal? unitPrice)
        {
            Item source = new ();
            source.UnitPrice = unitPrice;
            source.TotalPrice = totalPrice;
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().Be(source.TotalPrice);
        }

        [Fact]
        public void ResolveShouldReturnNull()
        {
            Item source = new();
            source.UnitPrice = null;
            source.TotalPrice = null;
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeNull();
        }
    }
}
