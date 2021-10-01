//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper
{
    public class ProductProfileTests
    {
        [Fact]
        public void ProductProfileTestIsValid()
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile<ProductProfile>());
            config.AssertConfigurationIsValid();
        }

        [Fact]
        public void ProductIndicatorsConverterTestNull()
        {
            // Arrange
            var converter = new ProductIndicatorsConverter();
            // Act
            var result = converter.Convert(null, null, null);
            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void ProductIndicatorsConverterTest()
        {
            // Arrange
            var converter = new ProductIndicatorsConverter();
            var productIndicator = new IndicatorDto()
            {
                Context = new ContextDto()
                {
                    SalesOrganization = "0100",
                },
                Values = new Dictionary<string, IndicatorValueDto>()
                {
                    {
                        "Warehouse",
                        new IndicatorValueDto()
                        {
                            Value = "Y"
                        }
                    },
                    {
                        "Returnable",
                        new IndicatorValueDto()
                        {
                            Value = "N"
                        }
                    }
                },
            };
            var productIndicators = new List<IndicatorDto>();
            productIndicators.Add(productIndicator);
            // Act
            var result = converter.Convert(productIndicators, null, null);
            // Assert
            result.Should().NotBeNull();
            result.WarehouseFlag.Should().BeTrue();
            result.ReturnableFlag.Should().BeFalse();
        }

        [Fact]
        public void ListPlantConverterTestNull()
        {
            // Arrange
            var converter = new ListPlantConverter();
            // Act
            var result = converter.Convert(null, null, null);
            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void ProductNotesConverterTestNull()
        {
            // Arrange
            var converter = new ProductNotesConverter();
            // Act
            var result = converter.Convert(null, null, null);
            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void ConvertProductsFromDtoToModelTestNull()
        {
            // Act
            var result = ProductProfile.ConvertProductsFromDtoToModel(null, null);
            // Assert
            result.Should().BeNull();
        }
    }
}
