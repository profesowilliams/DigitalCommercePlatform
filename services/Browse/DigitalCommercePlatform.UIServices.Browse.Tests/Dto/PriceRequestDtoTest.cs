//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Price;
using DigitalCommercePlatform.UIServices.Browse.Dto.Price.Internal;
using FluentAssertions;
using System;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Dto
{
    public class PriceRequestDtoTest
    {
        [Fact]
        public void Ctor_ProperlyConstructObject()
        {
            //arrange
            var id = Guid.NewGuid().ToString();
            var expected = new PriceRequestDto
            {
                Products = new PriceProductRequestDto[]
                {
                    new PriceProductRequestDto
                    {
                        ProductId=id
                    }
                }
            };

            //act
            var actual = new PriceRequestDto(id);

            //assert
            actual.Should().BeEquivalentTo(expected);
            actual.Details.Should().BeFalse();
            actual.IncludePromotionOptions.Should().BeTrue();
            actual.IncludeQuantityBreaks.Should().BeFalse();
            actual.Products.Single().Quantity.Should().Be(1);
        }
    }
}