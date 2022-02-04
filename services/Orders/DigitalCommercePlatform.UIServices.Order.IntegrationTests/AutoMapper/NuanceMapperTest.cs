//2021 (c) Tech Data Corporation - All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalCommercePlatform.UIServices.Order.Models.Order.Internal;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.IntegrationTests.AutoMapper
{
    public class NuanceMapperTest
    {
        [Theory]
        [AutoDomainData]
        public void NuanceProfile_X(OrderModel order)
        {
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new NuanceWebChatProfile());
            });
            var mapper = new Mapper(configuration);

            order.Status = Enum.Status.OPEN;
            order.Items[0].Parent = "0";
            order.Items[0].Status = Enum.Status.SHIPPED;
            order.Items[1].Parent = "0";
            order.Items[1].BackOrderIndicator = "Y";
            var response = mapper.Map<NuanceChatBotResponseModel>(order);
            response.Status.Should().Be("OPEN & IN PROCESS");
            response.Items[1].Status.Should().Be("Back Ordered");
        }

        [Theory]
        [AutoDomainData]
        public void NuanceProfile_Y(OrderModel order)
        {
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new NuanceWebChatProfile());
            });
            var mapper = new Mapper(configuration);

            order.Items = new List<ItemModel>()
            {
                new ItemModel()
                {
                    ID = "0100",
                    Parent = "0",
                    Shipments = new List<ShipmentModel>(),
                    DeliveryNotes = new List<DeliveryModel>(),
                    Status = Enum.Status.OPEN,
                },
                new ItemModel()
                {
                    ID = "0101",
                    Parent = "0100",
                    Status = Enum.Status.OPEN,
                    Shipments = new List<ShipmentModel>()
                    {
                        new ShipmentModel(),
                        new ShipmentModel()
                    },
                    DeliveryNotes = new List<DeliveryModel>()
                    {
                        new DeliveryModel(),
                        new DeliveryModel()
                    },
                },
            };
            var response = mapper.Map<NuanceChatBotResponseModel>(order);
            response.Items.Should().HaveCount(1);
            response.Items[0].Shipments.Should().HaveCount(2);
        }

        [Theory]
        [InlineDomainData("ZSBO", true)]
        [InlineDomainData("ZSER", true)]
        [InlineDomainData("ZZSB", true)]
        [InlineDomainData("", false)]
        [InlineDomainData("ABCDE", false)]
        [InlineDomainData("ABCD", false)]
        public void NuanceProfile_Z(string itemCategory, bool isDropShip, OrderModel order)
        {
            var configuration = new MapperConfiguration(config =>
            {
                config.AddProfile(new NuanceWebChatProfile());
            });
            var mapper = new Mapper(configuration);

            order.Status = Enum.Status.OPEN;
            order.Items[0].Parent = "0";
            order.Items[0].ItemCategory = itemCategory;
            var response = mapper.Map<NuanceChatBotResponseModel>(order);
            response.Items[0].IsDropShip.Should().Be(isDropShip);
        }
    }
}
