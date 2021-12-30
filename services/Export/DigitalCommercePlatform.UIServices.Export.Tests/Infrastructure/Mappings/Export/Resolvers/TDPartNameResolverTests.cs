//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export.Resolvers
{
    public class TDPartNameResolverTests 
    {
        private readonly TDPartNameResolver _resolver;

        public TDPartNameResolverTests()
        {
            _resolver = new();
        }

        internal class ResolveShouldReturnUnavailableData : TheoryData<Item>
        {
            public ResolveShouldReturnUnavailableData()
            {
                Add(new Item() { Product = new List<Product>() });
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "anyTECHDATA" },
                        new Product() { Type = "NOTECHDATA" },
                    }
                });
            }
        }

        [Theory]
        [ClassData(typeof(ResolveShouldReturnUnavailableData))]
        public void ResolveShouldReturnUnavailable(Item source)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType<string>();
            result.Should().Be("Unavailable");
        }

        internal class ResolveShouldReturnNameData : TheoryData<Item, string>
        {
            public ResolveShouldReturnNameData()
            {
                var name1 = "Name 1";
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "TECHDATA", Name = name1 },
                        new Product() { Type = "any" },
                        new Product() { Type = "any" }
                    }
                }, name1);

                var name2 = "name2";
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "any" },
                        new Product() { Type = "techdata", Name = name2 },
                        new Product() { Type = "any" }
                    }
                }, name2);

                var name3 = "Name-3";
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "any" },
                        new Product() { Type = "any" },
                        new Product() { Type = "TeCHdATa", Name = name3 },
                    }
                }, name3);
            }
        }

        [Theory]
        [ClassData(typeof(ResolveShouldReturnNameData))]
        public void ResolveShouldReturnName(Item source, string expectedManufacturer)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType<string>();
            result.Should().Be(expectedManufacturer);
        }
    }
}
