using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetOrders;
using DigitalCommercePlatform.UIServices.Order.Actions.Queries.GetSingleOrder;
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
        [Theory(DisplayName = "Map OrderModel to OrderDto")]
        [MemberData(nameof(GetModel))]
        public void OrderModelToOrderDtoSuccessfullMapTest(OrderModel source)
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

        [Trait("Category", "Get Object")]
        [Trait("Category", "Data Mapping")]
        [Theory(DisplayName = "Map OrderModel to SingleOrderResponse")]
        [MemberData(nameof(GetModel))]
        public void OrderModelToSingleOrderResponseSuccessfullMapTest(OrderModel source)
        {
            var target = GetMapper().Map<SingleOrderResponse>(source);

            target.Should().NotBeNull().And.BeAssignableTo<SingleOrderResponse>();

            target.ShipTo.City.Should().NotBeNull().And.Be(source.ShipTo.Address.City);
            target.ShipTo.Country.Should().NotBeNull().And.Be(source.ShipTo.Address.Country);
            target.ShipTo.Line1.Should().NotBeNull().And.Be(source.ShipTo.Address.Line1);
            target.ShipTo.Name.Should().NotBeNull().And.Be(source.ShipTo.Name);
            target.ShipTo.State.Should().NotBeNull().And.Be(source.ShipTo.Address.State);
            target.ShipTo.Zip.Should().NotBeNull().And.Be(source.ShipTo.Address.Zip);

            target.PaymentDetails.Currency.Should().NotBeNullOrEmpty().And.Be(source.Currency);
            target.PaymentDetails.NetValue.Should().NotBeNullOrEmpty().And.Be(source.Price.ToString());
            target.PaymentDetails.Reference.Should().NotBeNullOrEmpty().And.Be(source.CustomerPO);


            target.Customer.Should().NotBeNullOrEmpty().And.Be(source.ShipTo.Name);
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
                    CustomerPO = "66308427",
                    ShipTo = new AddressModel 
                    { 
                        Name = "sharvari bhandare",
                        Address = new AddressDetails
                        {
                            City = "LAKELAND",
                            Country = "US",
                            Line1 = "1200 BARTOW RD STE 30",
                            State = "FL",
                            Zip = "33801"
                        }
                    },
                    Source = new Source { ID = "726935" },
                    Status = Status.PROCESSING
                }
            };
        }
    }
}
