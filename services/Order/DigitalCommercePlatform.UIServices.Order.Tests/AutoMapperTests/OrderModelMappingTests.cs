using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using FluentAssertions;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.AutoMapperTests
{
    public class OrderModelMappingTests : BaseTest
    {
        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map OrderModel")]
        [MemberData(nameof(GetModel))]
        public void OrderModelSuccessfullMapTest(OrderModel source)
        {
            var target = GetMapper().Map<OrderDto>(source);

            target.Should().NotBeNull().And.BeAssignableTo<OrderDto>();

            target.Created.Should().NotBeNull().And.Be(source.Created);
            target.Status.Should().NotBeNullOrEmpty().And.Be(source.Status.ToString());
            target.ShipTo.Should().NotBeNullOrEmpty().And.Be(source.ShipTo.Name);
            target.Id.Should().NotBeNullOrEmpty().And.Be(source.Source.ID);
            target.Type.Should().NotBeNullOrEmpty().And.Be(source.DocType);
            target.Price.Should().NotBeNullOrEmpty().And.Be($"{source.Price} {source.Currency}");

        }

        public static TheoryData<OrderModel> GetModel()
        {
            return new TheoryData<OrderModel>()
            {
                new OrderModel
                {
                    Created = new DateTime(2020,12,28),
                    Currency = "CAD",
                    DocType = "ZOR",
                    Price = 1856.20M,
                    ShipTo = new AddressModel { Name = "sharvari bhandare" },
                    Source = new Source { ID = "726935" },
                    Status = Status.PROCESSING
                }
            };
        }
    }
}
