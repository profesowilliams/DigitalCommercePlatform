//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Infrastructure.Mappings.Export.Resolvers
{
    public class ManufacturerResolverTests
    {
        private readonly ManufacturerResolver _resolver;

        public ManufacturerResolverTests()
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

        internal class ResolveShouldReturnManufacturerData : TheoryData<Item, string>
        {
            public ResolveShouldReturnManufacturerData()
            {
                var manufacturer1 = "Manufacturer 1";
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "TECHDATA", Manufacturer = manufacturer1 },
                        new Product() { Type = "any" },
                        new Product() { Type = "any" }
                    }
                }, manufacturer1);

                var manufacturer2 = "Manufacturer 2";
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "any" },
                        new Product() { Type = "techdata", Manufacturer = manufacturer2 },
                        new Product() { Type = "any" }
                    }
                }, manufacturer2);

                var manufacturer3 = "Manufacturer 3";
                Add(new Item()
                {
                    Product = new List<Product>()
                    {
                        new Product() { Type = "any" },
                        new Product() { Type = "any" },
                        new Product() { Type = "TeCHdATa", Manufacturer = manufacturer3 },
                    }
                }, manufacturer3);
            }
        }

        [Theory]
        [ClassData(typeof(ResolveShouldReturnManufacturerData))]
        public void ResolveShouldReturnManufacturer(Item source, string expectedManufacturer)
        {
            var result = _resolver.Resolve(source, null, null, null);

            result.Should().BeOfType<string>();
            result.Should().Be(expectedManufacturer);
        }
    }
}
