//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings.ProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductVariant;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Automapper.ProductVariant
{
    public class ProductLookupResolverTests
    {
        public static IEnumerable<object[]> Data()
        {
            return new[]
            {
                new object[]
                {
                    new ProductVariantDto
                    {
                        AttributeGroups = new List<AttributeGroupDto>
                        {
                            new AttributeGroupDto
                            {
                                Attributes = new List<AttributeDto>
                                {
                                    new AttributeDto
                                    {
                                        Id =  "A00373",
                                        Values = new List<AttributeValueDto>
                                        {
                                            new AttributeValueDto
                                            {
                                                Id = "K1119427",
                                                ProductIds = new List<string>{ "14155593"}
                                            }
                                        }
                                    }
                                }
                            },
                            new AttributeGroupDto
                            {
                                Attributes = new List<AttributeDto>
                                {
                                    new AttributeDto
                                    {
                                        Id =  "A00373",
                                        Values = new List<AttributeValueDto>
                                        {
                                            new AttributeValueDto
                                            {
                                                Id = "K1119427",
                                                ProductIds = new List<string>{ "14155593"}
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    new List<ProductLookupModel>
                    {
                        new ProductLookupModel
                        {
                            Key = "A00373:K1119427",
                            Value = new List<string>{ "14155593" }
                        }
                    }
                }
            };
        }

        [Theory]
        [AutoDomainData(nameof(Data))]
        public void Resolve(ProductVariantDto input, IEnumerable<ProductLookupModel> expected)
        {
            //arrange
            var sut = new ProductLookupResolver();

            //act
            var result = sut.Resolve(input, null, null, null);

            //assert
            result.Should().BeEquivalentTo(expected);
        }
    }
}