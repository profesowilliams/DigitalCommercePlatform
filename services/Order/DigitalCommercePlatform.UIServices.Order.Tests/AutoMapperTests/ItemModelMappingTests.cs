using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrderLines;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.AutoMapperTests
{
    public class ItemModelMappingTests : BaseTest
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map ItemModel")]
        [MemberData(nameof(GetModel))]
        public void ItemModelSuccessfullMapTest(Item source)
        {
            var target = GetMapper().Map<OrderLineResponse>(source);

            target.Should().NotBeNull().And.BeAssignableTo<OrderLineResponse>();

            target.Id.Should().NotBeNullOrEmpty().And.Be(source.ID);
            target.Currency.Should().NotBeNullOrEmpty().And.Be(source.Currency);
            target.Parent.Should().NotBeNullOrEmpty().And.Be(source.Parent);
            target.Quantity.Should().Be(source.Quantity);
            target.TotalPrice.Should().NotBeNull().And.Be(source.TotalPrice);
            target.UnitPrice.Should().NotBeNull().And.Be(source.UnitPrice);
            target.Description.Should().NotBeNullOrEmpty().And.Be(source.Product[0].Name);
        }

        public static TheoryData<Item> GetModel()
        {
            return new TheoryData<Item>()
            {
                new Item
                {
                    ID = "10",
                    Currency = "CAD",
                    Parent = "0",
                    Quantity = 2,
                    TotalPrice = 1856.20M,
                    UnitPrice = 928.10M,
                    Product = new List<Product>
                    {
                        new Product { Name = "CATALYST 2960C SWITCH 8 FE, 2 X DUAL UPL" }
                    }
                }
            };
        }
    }
}
