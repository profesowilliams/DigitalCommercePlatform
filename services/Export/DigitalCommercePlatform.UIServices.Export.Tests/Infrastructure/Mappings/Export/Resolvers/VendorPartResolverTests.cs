//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export.Resolvers
{
    public class VendorPartResolverTests
    {
        private readonly VendorPartResolver _resolver;

        public VendorPartResolverTests()
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
                        new Product() { Type = "anyMANUFACTURER" },
                        new Product() { Type = "NOMANUFACTURER" },
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

        internal class ResolveShouldReturnIdData : TheoryData<Item, string>
        {
            public ResolveShouldReturnIdData()
            {
                var s1 = new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "MANUFACTURER", Id = "id 1" },
                        new Product() { Type = "any" },
                        new Product() { Type = "any" }
                    }
                };
                Add(s1, s1.Product[0].Id);

                var s2 = new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "any" },
                        new Product() { Type = "manufacturer", Id = "id2" },
                        new Product() { Type = "any" }
                    }
                };
                Add(s2, s2.Product[1].Id);

                var s3 = new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "any" },
                        new Product() { Type = "any" },
                        new Product() { Type = "MaNufaCTUReR", Id = "id-3" },
                    }
                };
                Add(s3, s3.Product[2].Id);
            }
        }

        [Theory]
        [ClassData(typeof(ResolveShouldReturnIdData))]
        public void ResolveShouldReturnId(Item source, string expectedId)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType<string>();
            result.Should().Be(expectedId);
        }
    }
}
