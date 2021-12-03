//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.ProductCompare.Internal;
using DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetProductsCompare
{
    public class GetProductsCompareTests
    {
        private readonly Mock<IMiddleTierHttpClient> _httpClientMock;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly Browse.Actions.GetProductsCompare.Handler _sut;

        public GetProductsCompareTests()
        {
            _httpClientMock = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<IAppSettings>();
            _siteSettingsMock = new Mock<ISiteSettings>();
            _appSettingsMock.Setup(x => x.GetSetting("Product.App.Url")).Returns("http://appproduct");
            _siteSettingsMock.Setup(x => x.GetSetting("Browse.UI.OnOrderArrivalDateFormat")).Returns("yyyy'/'MM'/'dd");

            _sut = new Browse.Actions.GetProductsCompare.Handler(_httpClientMock.Object, _appSettingsMock.Object, _siteSettingsMock.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task Handler_CallProductForDataAndValidate(Browse.Actions.GetProductsCompare.Request request)
        {
            //arrange
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null, null))
                .ReturnsAsync(Array.Empty<ProductDto>())
                .Verifiable();
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ValidateDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null, null))
                .ReturnsAsync(Array.Empty<ValidateDto>())
                .Verifiable();

            //act
            _ = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            _httpClientMock.Verify();
        }

        [Theory]
        [AutoDomainData]
        public async Task Handler_ProperlyCalculateSpecificationMatrix(Browse.Actions.GetProductsCompare.Request request, IEnumerable<ProductDto> productDtos)
        {
            //arrange
            productDtos.First().ExtendedSpecifications = null;

            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null, null))
                .ReturnsAsync(productDtos)
                .Verifiable();
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ValidateDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null, null))
                .ReturnsAsync(Array.Empty<ValidateDto>())
                .Verifiable();

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.SpecificationGroups.Should().HaveCount(6);
            actual.SpecificationGroups.All(x => x.Specifications.Count() == 3).Should().BeTrue();
            actual.SpecificationGroups.All(x => x.Specifications.All(s => s.Values.Count() == 3)).Should().BeTrue();
            actual.SpecificationGroups.All(x => x.Specifications.All(s => !s.IsIdentical)).Should().BeTrue();
        }

        [Theory]
        [AutoDomainData(nameof(Handler_ProperlyMapProducts_Data))]
        public async Task Handler_ProperlyMapProducts(IEnumerable<ProductDto> productDtos, IEnumerable<ValidateDto> validateDtos, ProductModel expectedProduct, Browse.Actions.GetProductsCompare.Request request)
        {
            //arrange
            request.SalesOrg = "0100";

            productDtos.First().ExtendedSpecifications = null;

            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ProductDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null, null))
                .ReturnsAsync(productDtos)
                .Verifiable();
            _httpClientMock.Setup(x => x.GetAsync<IEnumerable<ValidateDto>>(It.Is<string>(x => x.StartsWith("http://appproduct")), null, null, null))
                .ReturnsAsync(validateDtos)
                .Verifiable();

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Products.First().Should().BeEquivalentTo(expectedProduct);
        }

        public static IEnumerable<object> Handler_ProperlyMapProducts_Data()
        {
            return new[]
            {
                new object[]
                {
                    new List<ProductDto>
                    {
                        new ProductDto
                        {
                            Source=new SourceDto{ Id =  "p1", System="2"},
                            ManufacturerPartNumber="ManufacturerPartNumber1",
                            Description="Description1",
                            Indicators = new List<IndicatorDto>
                            {
                                new IndicatorDto
                                {
                                    Context = new ContextDto{ SalesOrganization="0100"},
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"DropShip", new IndicatorValueDto{ Value="Y"} },
                                        { "AuthRequiredPrice", new IndicatorValueDto{ Value="N"} }
                                    }
                                },
                                new IndicatorDto
                                {
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"Orderable", new IndicatorValueDto{ Value="Y"} }
                                    }
                                }
                            },
                            ShortDescription="shortDescription1",

                            Images = new Dictionary<string, IEnumerable<ImageDto>>
                            {
                                { "75x75", new List<ImageDto>{ new ImageDto { Type="Product shot", Url="url"} } }
                            },
                            Stock = new StockDto
                            {
                                VendorDesignated=1,
                                Td=1,
                                Total=2
                            },
                            Plants = new List<PlantDto>
                            {
                                new PlantDto
                                {
                                    Id="Plant",
                                    Stock = new LocationStockDto
                                    {
                                        AvailableToPromise=1,
                                        LocationName = "Warehouse 123",
                                        OnOrder = new OnOrderDto
                                        {
                                            Stock = 44,
                                            ArrivalDate = new DateTime(2044, 12, 31),
                                        }
                                    }
                                }
                            },
                            Price = new PriceDto
                            {
                                BasePrice=10,
                                BestPrice=1,
                                BestPriceExpiration=new DateTime(2100,1,1),
                                ListPrice= 2,
                                VolumePricing = new List<VolumePricingDto>
                                {
                                    new VolumePricingDto
                                    {
                                        MinQuantity=1,
                                        Price=3
                                    }
                                }
                            }
                        }
                    },
                    new List<ValidateDto>
                    {
                        new ValidateDto
                        {
                            Source=new Source{ Id="p1", System="2"},
                            Restriction="ALLOW"
                        }
                    },
                    new ProductModel
                    {
                        Id="p1",
                        ManufacturerPartNumber="ManufacturerPartNumber1",
                        Description="Description1",
                        DisplayName = "shortDescription1",
                        ThumbnailImage="url",
                        Stock = new StockModel
                        {
                            TotalAvailable=2,
                            VendorDirectInventory=1,
                            VendorShipped=true,
                            Plants = new List<PlantModel>
                            {
                                new PlantModel
                                {
                                    Name="Warehouse 123",
                                    Quantity=1,
                                    OnOrder = new OnOrderModel
                                    {
                                        Stock = 44,
                                        ArrivalDate = "2044/12/31",
                                    }
                                }
                            }
                        },
                        Authorization= new AuthorizationModel
                        {
                            CanOrder=true,
                            CanViewPrice=true
                        },
                        Price = new PriceModel
                        {
                            BasePrice=10,
                            BestPrice=1,
                            BestPriceExpiration=new DateTime(2100,1,1),
                            ListPrice=2,
                            VolumePricing= new List<VolumePricingModel>
                            {
                                new VolumePricingModel
                                {
                                    MinQuantity=1,
                                    Price=3
                                }
                            }
                        }
                    }
                },
                new object[]
                {
                    new List<ProductDto>
                    {
                        new ProductDto
                        {
                            Source=new SourceDto{ Id =  "p1", System="2"},
                            ManufacturerPartNumber="ManufacturerPartNumber1",
                            Description="Description1",
                            ShortDescription="shortDescription1",

                            Images = new Dictionary<string, IEnumerable<ImageDto>>
                            {
                                { "75x75", new List<ImageDto>{ new ImageDto { Type="Product shot", Url="url"} } }
                            },
                            Stock = new StockDto
                            {
                                VendorDesignated=1,
                                Td=1,
                                Total=2
                            },
                            Plants = new List<PlantDto>
                            {
                                new PlantDto
                                {
                                    Id="Plant",
                                    Stock = new LocationStockDto
                                    {
                                        AvailableToPromise=1,
                                        LocationName = "Warehouse 123",
                                    }
                                }
                            },
                            Price = new PriceDto
                            {
                                BasePrice=10,
                                BestPrice=1,
                                BestPriceExpiration=new DateTime(2100,1,1),
                                ListPrice= 2,
                                VolumePricing = new List<VolumePricingDto>
                                {
                                    new VolumePricingDto
                                    {
                                        MinQuantity=1,
                                        Price=3
                                    }
                                }
                            }
                        }
                    },
                    new List<ValidateDto>
                    {
                        new ValidateDto
                        {
                            Source=new Source{ Id="p1", System="2"},
                            Restriction="DENY"
                        }
                    },
                    new ProductModel
                    {
                        Id="p1",
                        ManufacturerPartNumber="ManufacturerPartNumber1",
                        Description="Description1",
                        DisplayName = "shortDescription1",
                        ThumbnailImage="url",
                        Stock = new StockModel
                        {
                            TotalAvailable=2,
                            VendorDirectInventory=1,
                            VendorShipped=false,
                            Plants = new List<PlantModel>
                            {
                                new PlantModel
                                {
                                    Name="Warehouse 123",
                                    Quantity=1
                                }
                            }
                        },
                        Authorization= new AuthorizationModel
                        {
                            CanOrder=false,
                            CanViewPrice=true
                        },
                        Price = new PriceModel
                        {
                            BasePrice=10,
                            BestPrice=1,
                            BestPriceExpiration=new DateTime(2100,1,1),
                            ListPrice=2,
                            VolumePricing= new List<VolumePricingModel>
                            {
                                new VolumePricingModel
                                {
                                    MinQuantity=1,
                                    Price=3
                                }
                            }
                        }
                    }
                }
            };
        }

        [Theory]
        [AutoDomainData]
        public void Validator_ReturnValid(Browse.Actions.GetProductsCompare.Request request)
        {
            //arrange
            var sut = new Browse.Actions.GetProductsCompare.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [AutoDomainData(nameof(Validator_ReturnInValid_Data))]
        public void Validator_ReturnInValid(Browse.Actions.GetProductsCompare.Request request, string notValidProperty)
        {
            //arrange
            var sut = new Browse.Actions.GetProductsCompare.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(notValidProperty);
        }

        public static IEnumerable<object> Validator_ReturnInValid_Data()
        {
            return new[]
            {
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=null,
                        SalesOrg="0100",
                        Site="US"
                    },
                    "Ids"
                },
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=Array.Empty<string>(),
                        SalesOrg="0100",
                        Site="US"
                    },
                    "Ids"
                },
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=new string[]{"id1" },
                        SalesOrg="0100",
                        Site="US"
                    },
                    "Ids"
                },
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=new string[]{"id1", "id2" },
                        SalesOrg=null,
                        Site="US"
                    },
                    "SalesOrg"
                },
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=new string[]{"id1", "id2" },
                        SalesOrg="",
                        Site="US"
                    },
                    "SalesOrg"
                },
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=new string[]{"id1", "id2" },
                        SalesOrg="0100",
                        Site=""
                    },
                    "Site"
                },
                new object[]
                {
                    new Browse.Actions.GetProductsCompare.Request
                    {
                        Ids=new string[]{"id1", "id2" },
                        SalesOrg="0100",
                        Site=null
                    },
                    "Site"
                }
            };
        }
    }
}