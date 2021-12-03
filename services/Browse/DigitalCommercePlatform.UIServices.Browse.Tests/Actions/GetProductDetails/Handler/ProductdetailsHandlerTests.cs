//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product;
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Dto.Validate;
using DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product;
using DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class ProductDetailsHandlerTests
    {
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly GetProductDetailsHandler.Handler _sut;
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<ISiteSettings> _siteSettingsMock;
        private readonly Mapper _mapper;

        public ProductDetailsHandlerTests()
        {
            _mockBrowseService = new();
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(x => x.GetSetting("Product.App.Url")).Returns("http://appproduct");

            _siteSettingsMock = new Mock<ISiteSettings>();
            _siteSettingsMock.Setup(x => x.GetSetting("Browse.UI.ImageSize")).Returns("400x300");
            _siteSettingsMock.Setup(x => x.GetSetting("Browse.UI.OnOrderArrivalDateFormat")).Returns("yyyy'/'MM'/'dd");

            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new ProductProfile())));

            _sut = new GetProductDetailsHandler.Handler(_mockBrowseService.Object, _siteSettingsMock.Object, _mapper);
        }

        public IReadOnlyCollection<string> Id { get; private set; }
        public bool Details { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(IEnumerable<ProductDto> expected)
        {
            expected.First().Plants.First().Stock.OnOrder = new OnOrderDto
            {
                Stock = 44,
                ArrivalDate = new DateTime(2044, 12, 31)
            };
            _mockBrowseService.Setup(x => x.GetProductDetails(
                       It.IsAny<GetProductDetailsHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var request = new GetProductDetailsHandler.Request(Id, "0100", "US");

            var result = await _sut.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
            result.Content.First().Stock.Plants.First().OnOrder.Should().NotBeNull();
            result.Content.First().Stock.Plants.First().OnOrder.Stock.Should().Be(44);
            result.Content.First().Stock.Plants.First().OnOrder.ArrivalDate.Should().Be("2044/12/31");
        }

        [Theory]
        [AutoDomainData(nameof(Handler_ProperlyMapProducts_Data))]
        [AutoDomainData(nameof(Handler_ProperlyMapProductsMarketingsNull_Data))]
        [AutoDomainData(nameof(Handler_ProperlyMapProductsWhatsInTheBoxNullUrlNull_Data))]
        public async Task Handler_ProperlyMapProducts(IEnumerable<ProductDto> productDtos, IEnumerable<ValidateDto> validateDtos, ProductModel expectedProduct, GetProductDetailsHandler.Request request)
        {
            //arrange
            request.SalesOrg = "0100";

            _mockBrowseService.Setup(x => x.GetProductDetails(request))
                .ReturnsAsync(productDtos)
                .Verifiable();
            _mockBrowseService.Setup(x => x.ValidateProductTask(request.Id))
                .ReturnsAsync(validateDtos)
                .Verifiable();

            //act
            var actual = await _sut.Handle(request, default).ConfigureAwait(false);

            //assert
            actual.Should().NotBeNull();
            actual.Content.First().Should().BeEquivalentTo(expectedProduct);
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
                            DisplayName="DisplayName",
                            Indicators = new List<IndicatorDto>
                            {
                                new IndicatorDto
                                {
                                    Context = new ContextDto{ SalesOrganization="0100"},
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"DropShip", new IndicatorValueDto{ Value="Y"} },
                                        { "AuthRequiredPrice", new IndicatorValueDto{ Value="Y"} },
                                        { "EndUserRequired", new IndicatorValueDto{ Value="Y"} },
                                        { "New", new IndicatorValueDto{ Value="Y"} },
                                        { "Refurbished", new IndicatorValueDto{ Value="Y"} },
                                        { "Returnable", new IndicatorValueDto{ Value="Y"} },
                                        { "Virtual", new IndicatorValueDto{ Value="Y"} },
                                        { "Warehouse", new IndicatorValueDto{ Value="Y"} },
                                        { "DisplayStatus", new IndicatorValueDto{ Value="Active"} },
                                        { "FreightPolicyException", new IndicatorValueDto{Value = "X"} }
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
                                { "400x300", new List<ImageDto>{ new ImageDto { Angle="Product shot", Url="imgurl"} } }
                            },
                            Logos = new Dictionary<string, IEnumerable<LogoDto>>
                            {
                                { "400x300", new List<LogoDto>{ new LogoDto { Id="logoId", Url="logourl"} } }
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
                                        LocationName = "Warehouse 123",
                                        AvailableToPromise=1
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
                            },
                            ExtendedSpecifications = new List<ExtendedSpecificationDto>
                            {
                                new ExtendedSpecificationDto
                                {
                                    GroupName="group1",
                                    Specifications = new List<SpecificationDto>
                                    {
                                        new SpecificationDto
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    }
                                }
                            },
                            MainSpecifications = new List<MainSpecificationDto>
                                    {
                                        new MainSpecificationDto
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    },
                            SalesOrganizations = new List<SalesOrganizationDto>
                            {
                                new SalesOrganizationDto
                                {
                                    Id="0100",
                                    ProductNotes = new List<ProductNoteDto>
                                    {
                                        new ProductNoteDto
                                        {
                                            Type="PromoText",
                                            Note="note"
                                        }
                                    }
                                }
                            },
                            Marketing = new List<MarketingDto>
                            {
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "Key Selling Points",
                                    Url = "http://cdn.cnetcontent.com/b9/a1/b9a1f953-2ac4-4e92-9101-5210b76b2b1c.xml"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "What's in the Box",
                                    Url = "http://cdn.cnetcontent.com/b9/a1/b9a1f953-2ac4-4e92-9101-5210b76b2b1c.xml"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "Marketing description",
                                    Url = "http://cdn.cnetcontent.com/b9/a1/b9a1f953-2ac4-4e92-9101-5210b76b2b1c.xml"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "Product Features",
                                    Url = "http://cdn.cnetcontent.com/b9/a1/b9a1f953-2ac4-4e92-9101-5210b76b2b1c.xml"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "PDF",
                                    Name = "User Manual",
                                    Url = "http://cdn.cnetcontent.com/99/20/99200010-0ea4-4549-872f-f27874bf5d99.pdf"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "PDF",
                                    Name = "Product Data Sheet / Brochure",
                                    Url = "http://cdn.cnetcontent.com/99/20/99200010-0ea4-4549-872f-f27874bf5d99.pdf"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "PDF",
                                    Name = "Quick Start Guide",
                                    Url = "http://cdn.cnetcontent.com/99/20/99200010-0ea4-4549-872f-f27874bf5d99.pdf"
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "test",
                                    Url = "http://cdn.cnetcontent.com/b9/a1/b9a1f953-2ac4-4e92-9101-5210b76b2b1c.xml"
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
                        DisplayName = "DisplayName",
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
                        },
                        Images = new List<ImageModel>
                        {
                            new ImageModel{ Angle = "Product shot", Url="imgurl"},
                            new ImageModel{ Angle = "Logo", Url="logourl"},
                        },
                        IndicatorsFlags = new IndicatorFlags
                        {
                            DropShip=true,
                            EndUserRequired=true,
                            New=true,
                            Refurbished=true,
                            Returnable=true,
                            Virtual=true,
                            Warehouse=true,
                            FreeShipping=false
                        },
                        Status="Active",
                        Specifications = new ProductSpecificationsModel
                        {
                            ExtendedSpecifications=new List<ExtendedSpecificationModel>
                            {
                                new ExtendedSpecificationModel
                                {
                                    Group="group1",
                                    GroupSpecifications = new List<SpecificationModel>
                                    {
                                        new SpecificationModel
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    }
                                }
                            },
                            MainSpecifications = new List<MainSpecificationModel>
                            {
                                new MainSpecificationModel
                                {
                                    Name="specName",
                                    Value="specValue"
                                }
                            }
                        },
                        Notes = new List<NoteModel>
                        {
                            new NoteModel
                            {
                                Value="note"
                            }
                        },
                        MarketingDescription = "Maximum performance and reliabilityEco-friendly",
                        KeySellingPoints = new string[] { "Maximum performance and reliability", "Eco-friendly" },
                        ProductFeatures = new string[] { ". Maximum performance and reliability", ". Eco-friendly" },
                        WhatsInTheBox = new string[] { "Maximum performance and reliability", "Eco-friendly" },
                        Documents = new List<DocumentModel>
                        {
                            new DocumentModel
                            {
                                Title = "Quick Start Guide",
                                Type = "PDF",
                                Url = "http://cdn.cnetcontent.com/99/20/99200010-0ea4-4549-872f-f27874bf5d99.pdf"
                            },
                            new DocumentModel
                            {
                                Title = "Product Data Sheet / Brochure",
                                Type = "PDF",
                                Url = "http://cdn.cnetcontent.com/99/20/99200010-0ea4-4549-872f-f27874bf5d99.pdf"
                            },
                            new DocumentModel
                            {
                                Title = "User Manual",
                                Type = "PDF",
                                Url = "http://cdn.cnetcontent.com/99/20/99200010-0ea4-4549-872f-f27874bf5d99.pdf"
                            }
                        }
                    }
                }
            };
        }

        public static IEnumerable<object> Handler_ProperlyMapProductsMarketingsNull_Data()
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
                            DisplayName="DisplayName",
                            Indicators = new List<IndicatorDto>
                            {
                                new IndicatorDto
                                {
                                    Context = new ContextDto{ SalesOrganization="0100"},
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"DropShip", new IndicatorValueDto{ Value="Y"} },
                                        { "AuthRequiredPrice", new IndicatorValueDto{ Value="Y"} },
                                        { "EndUserRequired", new IndicatorValueDto{ Value="Y"} },
                                        { "New", new IndicatorValueDto{ Value="Y"} },
                                        { "Refurbished", new IndicatorValueDto{ Value="Y"} },
                                        { "Returnable", new IndicatorValueDto{ Value="Y"} },
                                        { "Virtual", new IndicatorValueDto{ Value="Y"} },
                                        { "Warehouse", new IndicatorValueDto{ Value="Y"} },
                                        { "DisplayStatus", new IndicatorValueDto{ Value="Active"} },
                                        { "FreightPolicyException", new IndicatorValueDto{Value = "Y"} }
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
                                { "400x300", new List<ImageDto>{ new ImageDto { Angle="Product shot", Url="imgurl"} } }
                            },
                            Logos = new Dictionary<string, IEnumerable<LogoDto>>
                            {
                                { "400x300", new List<LogoDto>{ new LogoDto { Id="logoId", Url="logourl"} } }
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
                            },
                            ExtendedSpecifications = new List<ExtendedSpecificationDto>
                            {
                                new ExtendedSpecificationDto
                                {
                                    GroupName="group1",
                                    Specifications = new List<SpecificationDto>
                                    {
                                        new SpecificationDto
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    }
                                }
                            },
                            MainSpecifications = new List<MainSpecificationDto>
                                    {
                                        new MainSpecificationDto
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    },
                            SalesOrganizations = new List<SalesOrganizationDto>
                            {
                                new SalesOrganizationDto
                                {
                                    Id="0100",
                                    ProductNotes = new List<ProductNoteDto>
                                    {
                                        new ProductNoteDto
                                        {
                                            Type="PromoText",
                                            Note="note"
                                        }
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
                        DisplayName = "DisplayName",
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
                        },
                        Images = new List<ImageModel>
                        {
                            new ImageModel{ Angle = "Product shot", Url="imgurl"},
                            new ImageModel{ Angle = "Logo", Url="logourl"},
                        },
                        IndicatorsFlags = new IndicatorFlags
                        {
                            DropShip=true,
                            EndUserRequired=true,
                            New=true,
                            Refurbished=true,
                            Returnable=true,
                            Virtual=true,
                            Warehouse=true,
                            FreeShipping=true
                        },
                        Status="Active",
                        Specifications = new ProductSpecificationsModel
                        {
                            ExtendedSpecifications=new List<ExtendedSpecificationModel>
                            {
                                new ExtendedSpecificationModel
                                {
                                    Group="group1",
                                    GroupSpecifications = new List<SpecificationModel>
                                    {
                                        new SpecificationModel
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    }
                                }
                            },
                            MainSpecifications = new List<MainSpecificationModel>
                            {
                                new MainSpecificationModel
                                {
                                    Name="specName",
                                    Value="specValue"
                                }
                            }
                        },
                        Notes = new List<NoteModel>
                        {
                            new NoteModel
                            {
                                Value="note"
                            }
                        }
                    }
                }
            };
        }

        public static IEnumerable<object> Handler_ProperlyMapProductsWhatsInTheBoxNullUrlNull_Data()
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
                            DisplayName="DisplayName",
                            Indicators = new List<IndicatorDto>
                            {
                                new IndicatorDto
                                {
                                    Context = new ContextDto{ SalesOrganization="0100"},
                                    Values = new Dictionary<string, IndicatorValueDto>
                                    {
                                        {"DropShip", new IndicatorValueDto{ Value="Y"} },
                                        { "AuthRequiredPrice", new IndicatorValueDto{ Value="Y"} },
                                        { "EndUserRequired", new IndicatorValueDto{ Value="Y"} },
                                        { "New", new IndicatorValueDto{ Value="Y"} },
                                        { "Refurbished", new IndicatorValueDto{ Value="Y"} },
                                        { "Returnable", new IndicatorValueDto{ Value="Y"} },
                                        { "Virtual", new IndicatorValueDto{ Value="Y"} },
                                        { "Warehouse", new IndicatorValueDto{ Value="Y"} },
                                        { "DisplayStatus", new IndicatorValueDto{ Value="Active"} },
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
                                { "400x300", new List<ImageDto>{ new ImageDto { Angle="Product shot", Url="imgurl"} } }
                            },
                            Logos = new Dictionary<string, IEnumerable<LogoDto>>
                            {
                                { "400x300", new List<LogoDto>{ new LogoDto { Id="logoId", Url="logourl"} } }
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
                            },
                            ExtendedSpecifications = new List<ExtendedSpecificationDto>
                            {
                                new ExtendedSpecificationDto
                                {
                                    GroupName="group1",
                                    Specifications = new List<SpecificationDto>
                                    {
                                        new SpecificationDto
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    }
                                }
                            },
                            MainSpecifications = new List<MainSpecificationDto>
                                    {
                                        new MainSpecificationDto
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    },
                            SalesOrganizations = new List<SalesOrganizationDto>
                            {
                                new SalesOrganizationDto
                                {
                                    Id="0100",
                                    ProductNotes = new List<ProductNoteDto>
                                    {
                                        new ProductNoteDto
                                        {
                                            Type="PromoText",
                                            Note="note"
                                        }
                                    }
                                }
                            },
                            Marketing = new List<MarketingDto>
                            {
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "Key Selling Points",
                                    Url = null
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "Marketing description",
                                    Url = null
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "Product Features",
                                    Url = null
                                },
                                new MarketingDto
                                {
                                    Id = "b9a1f953-2ac4-4e92-9101-5210b76b2b1c",
                                    Format = "XML",
                                    Name = "test",
                                    Url = "http://cdn.cnetcontent.com/b9/a1/b9a1f953-2ac4-4e92-9101-5210b76b2b1c.xml"
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
                        DisplayName = "DisplayName",
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
                        },
                        Images = new List<ImageModel>
                        {
                            new ImageModel{ Angle = "Product shot", Url="imgurl"},
                            new ImageModel{ Angle = "Logo", Url="logourl"},
                        },
                        IndicatorsFlags = new IndicatorFlags
                        {
                            DropShip=true,
                            EndUserRequired=true,
                            New=true,
                            Refurbished=true,
                            Returnable=true,
                            Virtual=true,
                            Warehouse=true,
                            FreeShipping = true
                        },
                        Status="Active",
                        Specifications = new ProductSpecificationsModel
                        {
                            ExtendedSpecifications=new List<ExtendedSpecificationModel>
                            {
                                new ExtendedSpecificationModel
                                {
                                    Group="group1",
                                    GroupSpecifications = new List<SpecificationModel>
                                    {
                                        new SpecificationModel
                                        {
                                            Name="specName",
                                            Value="specValue"
                                        }
                                    }
                                }
                            },
                            MainSpecifications = new List<MainSpecificationModel>
                            {
                                new MainSpecificationModel
                                {
                                    Name="specName",
                                    Value="specValue"
                                }
                            }
                        },
                        Notes = new List<NoteModel>
                        {
                            new NoteModel
                            {
                                Value="note"
                            }
                        },
                        MarketingDescription = null,
                        KeySellingPoints = null,
                        ProductFeatures = null,
                        WhatsInTheBox = null
                    }
                }
            };
        }
    }
}