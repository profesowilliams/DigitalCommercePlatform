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

            target.Lines.Count.Should().Be(source.Items.Count);
            target.Lines[0].Currency.Should().NotBeNullOrEmpty().And.Be(source.Items[0].Currency);
            target.Lines[0].Description.Should().NotBeNullOrEmpty().And.Be(source.Items[0].Product[0].Name);
            target.Lines[0].Id.Should().NotBeNullOrEmpty().And.Be(source.Items[0].ID);
            target.Lines[0].Parent.Should().NotBeNullOrEmpty().And.Be(source.Items[0].Parent);
            target.Lines[0].Quantity.Should().Be(source.Items[0].Quantity);
            target.Lines[0].TotalPrice.Should().NotBeNull().And.Be(source.Items[0].TotalPrice);
            target.Lines[0].UnitPrice.Should().NotBeNull().And.Be(source.Items[0].UnitPrice);
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
                    Status = Status.PROCESSING,
                    Items = new System.Collections.Generic.List<Item>
                    {
                        new Item
                        {
                            ID = "1",
                            Currency = "USD",
                            Parent = "11",
                            Quantity = 24,
                            TotalPrice = 5,
                            UnitPrice = 24,
                            Product = new System.Collections.Generic.List<Product>
                            {
                                new Product
                                {
                                    Name = "Phone"
                                }
                            }
                        },
                        new Item
                        {
                            ID = "11",
                            Currency = "USD",
                            Parent = "111",
                            Quantity = 244,
                            TotalPrice = 55,
                            UnitPrice = 244,
                            Product = new System.Collections.Generic.List<Product>
                            {
                                new Product
                                {
                                    Name = "Tablet"
                                }
                            }
                        }
                    }
                }
            };
        }
    }
}
