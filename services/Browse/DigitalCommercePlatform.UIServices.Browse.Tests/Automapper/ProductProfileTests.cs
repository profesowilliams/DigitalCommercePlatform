//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using FluentAssertions;
using System.Collections.Generic;
using System.Linq;
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
                    { "New", new IndicatorValueDto() { Value = "Y" } },
                    { "Returnable", new IndicatorValueDto() { Value = "Y" } },
                    { "EndUserRequired", new IndicatorValueDto() { Value = "Y" } },
                    { "Refurbished", new IndicatorValueDto() { Value = "Y" } },
                    { "DropShip", new IndicatorValueDto() { Value = "Y" } },
                    { "Warehouse", new IndicatorValueDto() { Value = "Y" } },
                    { "Virtual", new IndicatorValueDto() { Value = "Y" } },
                }
            };
            var productIndicators = new List<IndicatorDto>();
            productIndicators.Add(productIndicator);
            // Act
            var result = converter.Convert(productIndicators, null, null);
            // Assert
            result.Should().NotBeNull();
            result.NewFlag.Should().BeTrue();
            result.ReturnableFlag.Should().BeTrue();
            result.EndUserRequiredFlag.Should().BeTrue();
            result.RefurbishedFlag.Should().BeTrue();
            result.DropShipFlag.Should().BeTrue();
            result.WarehouseFlag.Should().BeTrue();
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
        public void ProductNotesConverterTest()
        {
            // Arrange
            var converter = new ProductNotesConverter();
            var source = new List<SalesOrganizationDto>();
            var destination = new List<NoteModel>();
            // Act
            var result = converter.Convert(source, destination, null);
            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public void ProductNotesConverterTestData()
        {
            // Arrange
            const string TestNote = "Some product notes";
            var converter = new ProductNotesConverter();
            var source = new List<SalesOrganizationDto>();
            var saleOrganization = new SalesOrganizationDto();
            saleOrganization.ProductNotes = new List<ProductNoteDto>();
            saleOrganization.ProductNotes.Add(new ProductNoteDto() { Note = TestNote });
            source.Add(saleOrganization);
            var destination = new List<NoteModel>();
            // Act
            var result = converter.Convert(source, destination, null);
            // Assert
            result.First().Should().Equals(TestNote);
        }

        [Fact]
        public void ConvertProductsFromDtoToModelTestNull()
        {
            // Act
            var result = ProductProfile.ConvertProductsFromDtoToModel(null, null, null, null);
            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void ConvertProductsFromDtoToModelTest()
        {
            // Arrange
            var dtos = new List<ProductDto>();
            var models = new List<ProductModel>();
            // Act
            var result = ProductProfile.ConvertProductsFromDtoToModel(dtos, models, null, null);
            // Assert
            result.Should().BeEmpty();
        }
    }
}
