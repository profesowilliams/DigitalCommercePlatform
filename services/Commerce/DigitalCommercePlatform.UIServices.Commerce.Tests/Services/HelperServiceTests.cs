//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Xunit;
using DigitalFoundation.Common.TestUtilities;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class HelperServiceTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<HelperService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IHttpClientFactory> _httpClientFactory;
        public HelperServiceTests()
        {
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<HelperService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
            _httpClientFactory = new Mock<IHttpClientFactory>();
        }

        private HelperService GetHelperService()
        {
            return new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object, _httpClientFactory.Object);
        }

        private void InitiateHelperService(out Type type, out object objType)
        {
            type = typeof(HelperService);
            objType = Activator.CreateInstance(type,
                _logger.Object,
                _context.Object,
                _middleTierHttpClient.Object,
                _appSettings.Object,
                _httpClientFactory.Object
                );
        }


        [Fact]
        public void PopulateLinesFor_Test()
        {
            //arrange 
            Line testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)12.08,
            };

            List<Line> lstItems = new() { testLine };
            //Act
            var result = GetHelperService().PopulateLinesFor(lstItems, "Cisco", "");
            Assert.NotNull(result);
        }

        [Fact]
        public void PopulateLinesForWithSyatem_2_Test()
        {
            //arrange 
            Line testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)80.08,
                UnitListPrice = 100.08M,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)80.08,
            };

            List<Line> lstItems = new() { testLine };
            //Act
            var result = GetHelperService().PopulateLinesFor(lstItems, "Cisco", "2");
            Assert.NotNull(result);
        }
        [Fact]
        public void PopulateLinesForWithSyatem_Q_Test()
        {
            //arrange 
            Line testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)35.08,
                UnitListPrice = 100.08M,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)35.08,
            };

            List<Line> lstItems = new() { testLine };
            //Act
            var result = GetHelperService().PopulateLinesFor(lstItems, "Cisco", "Q");
            Assert.NotNull(result);
        }



        [Fact]
        public void GetAccountDetails()
        {
            var result = GetHelperService().GetCustomerAccountDetails();
            Assert.NotNull(result);
        }

        [Fact]
        public void GetAccountDetails_BuyMethod()
        {
            var result = GetHelperService().GetCustomerAccountDetails();
            Assert.NotNull(result.Result.BuyMethod);
        }

        [Fact]
        public void GetAccountDetails_Exception()
        {
            var result = GetHelperService().GetCustomerAccountDetails();
            Assert.Null(result.Exception);
        }

        [Fact]
        public void GetOrderPricingConditions()
        {
            TypeModel orderType = new();
            LevelModel orderLevel = new();

            var result = GetHelperService().GetOrderPricingConditions("2", out orderType, out orderLevel);

            Assert.True(result);
            Assert.NotNull(orderType);
            Assert.NotNull(orderLevel);

        }

        [Fact]
        public void GetOrderPricingConditionsNull()
        {
            // Arrange
            TypeModel orderType = new();
            LevelModel orderLevel = new();
            // Act
            var result = GetHelperService().GetOrderPricingConditions(null, out orderType, out orderLevel);
            // Assert
            Assert.True(result);
            Assert.NotNull(orderType);
            Assert.NotNull(orderLevel);
        }

        [Fact]
        public void GetParameterName()
        {
            var result = GetHelperService().GetParameterName("id");
            Assert.NotNull(result);
        }

        [Fact]
        public void TestPrivateMethods()
        {
            Type type = typeof(HelperService);
            var objType = Activator.CreateInstance(type,
                _logger.Object,
                _context.Object,
                _middleTierHttpClient.Object,
                _appSettings.Object, _httpClientFactory.Object);

            var getOrderPricingConditionMappings = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetOrderPricingConditionMappings" && x.IsPrivate);

            //Act
            var getOrderPricingMappings = (OrderPricingCondtionMapping)getOrderPricingConditionMappings.Invoke(objType, new object[] { "EduStudentStaff" });
            Assert.NotNull(getOrderPricingMappings);

        }

        /// <summary>
        ///  From here 
        /// </summary>
        [Fact]
        public void BuildQueryForProductApiCall_Test()
        {
            //ist<Line> items, string vendorName
            Line testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)12.08,
            };

            List<Line> lstItems = new() { testLine };


            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildQueryForProductApiCall" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { lstItems, "" });
            Assert.NotNull(result);
        }

        [Fact]
        public void BuildQueryString()
        {
            Line testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "SVS-UMB-SUP-E",
                TDNumber = "13517170",
                TotalPrice = (decimal?)12.08,
            };

            string productId = "SVS-UMB-SUP-E";
            // use string builder as flur is encoding "=" in Manufacturer Part Number resulting in wrong response
            StringBuilder sbManufacturer = new();
            StringBuilder sbVendorPart = new();

            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildQueryString" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { productId, sbManufacturer, sbVendorPart, testLine });
            Assert.NotNull(sbManufacturer?.ToString());
        }

        [Fact]
        public void MapLines_Test()
        {
            //arrange
            ProductsModel product = new()
            {
                Source = new Models.Quote.Quote.Internal.SourceModel { ID = "100023213" },
                Price = new PriceModel { BestPrice = (decimal?)10.10, ListPrice = (decimal?)10.10, UnpromotedPrice = (decimal?)12.45 },
                ManufacturerPartNumber = "C9200-NM-4X",
                DisplayName = "C9200-NM-4X displayName",
                Images = null,
                Logos = null,
                ShortDescription = "C9200-NM-4X Short Desc",
                GlobalManufacturer = "CISCO",
                Description = "C9200-NM-4X Description",
                Name = "C9200-NM-4X Name"
            };
            Line line = new();
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapLines" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { product, line, "" });
            Assert.Null(result);

        }

        [Fact]
        public void GetImageUrlForProduct_Test()
        {
            //arrange
            ProductsModel product = new()
            {
                Source = new Models.Quote.Quote.Internal.SourceModel { ID = "100023213" },
                Price = new PriceModel { BestPrice = (decimal?)10.10, ListPrice = (decimal?)10.10, UnpromotedPrice = (decimal?)12.45 },
                ManufacturerPartNumber = "C9200-NM-4X",
                DisplayName = "C9200-NM-4X displayName",
                Images = null,
                Logos = null,
                ShortDescription = "C9200-NM-4X Short Desc",
                GlobalManufacturer = "CISCO",
                Description = "C9200-NM-4X Description",
                Name = "C9200-NM-4X Name"
            };

            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetImageUrlForProduct" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { product });
            Assert.Equal(string.Empty, result);

        }

        [Fact]
        public void ProducUrlUsingLogo_Test()
        {
            //arrange
            ProductsModel product = new()
            {
                Source = new Models.Quote.Quote.Internal.SourceModel { ID = "100023213" },
                Price = new PriceModel { BestPrice = (decimal?)10.10, ListPrice = (decimal?)10.10, UnpromotedPrice = (decimal?)12.45 },
                ManufacturerPartNumber = "C9200-NM-4X",
                DisplayName = "C9200-NM-4X displayName",
                Images = null,
                Logos = null,
                ShortDescription = "C9200-NM-4X Short Desc",
                GlobalManufacturer = "CISCO",
                Description = "C9200-NM-4X Description",
                Name = "C9200-NM-4X Name"
            };

            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "ProducUrlUsingLogo" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { product });
            Assert.Equal(string.Empty, result);

        }
        [Fact]
        public void ProductUrlUsingImages_Test()
        {
            //arrange
            ProductsModel product = new()
            {
                Source = new Models.Quote.Quote.Internal.SourceModel { ID = "100023213" },
                Price = new PriceModel { BestPrice = (decimal?)10.10, ListPrice = (decimal?)10.10, UnpromotedPrice = (decimal?)12.45 },
                ManufacturerPartNumber = "C9200-NM-4X",
                DisplayName = "C9200-NM-4X displayName",
                Images = null,
                Logos = null,
                ShortDescription = "C9200-NM-4X Short Desc",
                GlobalManufacturer = "CISCO",
                Description = "C9200-NM-4X Description",
                Name = "C9200-NM-4X Name"
            };

            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "ProductUrlUsingImages" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { product });
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void MapLinesTests()
        {
            // Arrange
            Line line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)12.08,
            };

            SourceModel Source = new SourceModel()
            {
                ID = "123",
                SalesOrg = "0100",
                Key = "12",
                System = "12",
                TargetSystem = "12"
            };
            ProductsModel product = new ProductsModel() { Source = Source };

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapLines" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { product, line, "" });

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void MapAutorizationTests()
        {
            // Arrange
            AuthorizationModel Authorization = new AuthorizationModel();


            // Act
            var result = GetHelperService().MapAutorization(Authorization);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetCheckoutSystem_Test()
        {
            //arrange 
            SourceModel source = new SourceModel()
            {
                ID = "any",
                Key = "any",
                SalesOrg = "any",
                System = "Q",
                TargetSystem = "ECC"
            };
            //var hasDealOrEstimate = attributes.Where(n => n.Name.Equals("DEALIDENTIFIER", StringComparison.OrdinalIgnoreCase) ||
            //                                             n.Name.Equals("ORIGINALESTIMATEID")).Any();

            List<AttributeModel> attributes = new List<AttributeModel> { new AttributeModel { Name = "SHIPCOMPLETETYPE", Value = "" } };

            //Act
            var result = GetHelperService().GetCheckoutSystem(source, attributes);
            Assert.NotNull(result);
        }
        [Fact]
        public void GetCheckoutSystemSAPDeal_Test()
        {
            //arrange 
            SourceModel source = new SourceModel()
            {
                ID = "any",
                Key = "any",
                SalesOrg = "any",
                System = "any",
                TargetSystem = "any"
            };
            List<AttributeModel> attributes = new List<AttributeModel> { new AttributeModel { Name = "DEALIDENTIFIER", Value = "234234" } };

            //Act
            var result = GetHelperService().GetCheckoutSystem(source, attributes);
            Assert.NotNull(result);
        }
        [Fact]
        public void GetCheckoutSystemSAPEstimate_Test()
        {
            //arrange 
            SourceModel source = new SourceModel()
            {
                ID = "any",
                Key = "any",
                SalesOrg = "any",
                System = "any",
                TargetSystem = "any"
            };

            List<AttributeModel> attributes = new List<AttributeModel> { new AttributeModel { Name = "ORIGINALESTIMATEID", Value = "234234" } };

            //Act
            var result = GetHelperService().GetCheckoutSystem(source, attributes);
            Assert.NotNull(result);
        }
        /*
         "images": {
                        "75x75": [
                            {
                                "id": "f13c8e36-6944-4e6c-b0e2-173077576fd4",
                                "url": "http://cdn.cnetcontent.com/f1/3c/f13c8e36-6944-4e6c-b0e2-173077576fd4.jpg",
                                "type": "Product shot",
                                "angle": "Right-angle"
                            }
                        ],
                        "200x150": [
                            {
                                "id": "6f5b3854-0974-4e1b-8096-3999e751fbd0",
                                "url": "http://cdn.cnetcontent.com/6f/5b/6f5b3854-0974-4e1b-8096-3999e751fbd0.jpg",
                                "type": "Product shot",
                                "angle": "Right-angle"
                            }
                        ],
                        "400x300": [
                            {
                                "id": "a5fee24e-3593-4f19-ac40-f46aba66008f",
                                "url": "http://cdn.cnetcontent.com/a5/fe/a5fee24e-3593-4f19-ac40-f46aba66008f.jpg",
                                "type": "Product shot",
                                "angle": "Right-angle"
                            }
                        ]
                    },
                    "logos": {
                        "200x150": [
                            {
                                "id": "8a2f70e6-dd77-4f96-baf3-f15b81bd51be",
                                "url": "http://cdn.cnetcontent.com/8a/2f/8a2f70e6-dd77-4f96-baf3-f15b81bd51be.jpg"
                            }
                        ],
                        "400x300": [
                            {
                                "id": "cf622e18-7260-45dc-9bb4-619a2c6c7b56",
                                "url": "http://cdn.cnetcontent.com/cf/62/cf622e18-7260-45dc-9bb4-619a2c6c7b56.jpg"
                            }
                        ],
                        "75x75": [
                            {
                                "id": "46f9be56-2fce-4c1b-a86c-021c62f8bc3b",
                                "url": "http://cdn.cnetcontent.com/46/f9/46f9be56-2fce-4c1b-a86c-021c62f8bc3b.jpg"
                            }
                        ]
                    },
         */
        //[Fact]
        //public void SetProductQuery_Test()
        //{
        //    string manufacturer = "";
        //    string system = "CISCO";
        //    string[] arrProductIds = new string[2];
        //    string[] arrManufacturer = new string[2];
        //    int i = 1;

        //    Line line = new()
        //    {
        //        Quantity = 1,
        //        UnitPrice = (decimal?)12.08,
        //        Manufacturer = "CISCO",
        //        MFRNumber = "C9200-NM-4X",
        //        TDNumber = "13517170",
        //        TotalPrice = (decimal?)12.08,
        //    };

        //    Type type;
        //    object objType;
        //    InitiateHelperService(out type, out objType);

        //    var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
        //        .First(x => x.Name == "SetProductQuery" && x.IsPrivate);

        //    var result = queryLine.Invoke(objType, new object[] { manufacturer, system, arrProductIds, arrManufacturer, i, line });
        //    Assert.Null(result);
        //}

        [Fact]
        public void GetUnitListPriceFromAPIAsync_Tests()
        {
            // Arrange
            List<Line> lstLines = new List<Line>();
            Line line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)12.08,
            };
            Line line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "5P1000R",
                TDNumber = "11086168",
                TotalPrice = (decimal?)12.08,
            };
            lstLines.Add(line);
            lstLines.Add(line1);

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetUnitListPriceFromAPIAsync" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { lstLines });

            // Assert
            Assert.NotNull(result);
        }


        [Fact]
        public void MapDiscount_Q_Test()
        {
            string source = "Q";
            Line line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)80.20,
                UnitListPrice = 100.00M,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)80.08,
            };
            Discount[] discount = new Discount[1];

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapDiscount" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { source, line });

            // Assert
            Assert.NotNull(line);
        }

        [Fact]
        public void BuildShopProductAPIRequest_Tests()
        {
            // Arrange
            List<Line> lstLines = new List<Line>();
            Line line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)12.08,
            };
            Line line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Manufacturer = "CISCO",
                MFRNumber = "5P1000R",
                TDNumber = "11086168",
                TotalPrice = (decimal?)12.08,
            };
            lstLines.Add(line);
            lstLines.Add(line1);

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildShopProductAPIRequest" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { lstLines });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetLineDiscount_Tests()
        {
            // Arrange

            Line line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)80.20,
                UnitListPrice = 100.00M,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170",
                TotalPrice = (decimal?)80.08,
            };
            Discount[] discount = new Discount[1];

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetLineDiscount" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { line, discount });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void FilterOrderKitLines_Tests()
        {
            // Arrange 

            List<Item> lstLines = new List<Item>();
            Item line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                POSType = "KC"
            };
            Item line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KC",
                TotalPrice = (decimal?)12.08,
            };
            Item line2 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KH",
                TotalPrice = (decimal?)12.08,
            };
            lstLines.Add(line);
            lstLines.Add(line1);
            lstLines.Add(line2);
            Models.Order.Internal.OrderModel order = new()
            {
                Source = new() { ID = "I009092146", SalesOrg = "0100", System = "3" },
                Items = lstLines
            };

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "FilterOrderKitLines" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { order });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void FilterOrderSingleGATPLines_Tests()
        {
            // Arrange 

            List<Item> lstLines = ArrageLinesForFilterMethods();

            Models.Order.Internal.OrderModel order = new()
            {
                Source = new() { ID = "I009092146", SalesOrg = "0100", System = "3" },
                Items = lstLines
            };

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "FilterOrderGATPLines" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { order });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void MapSingleShipments_Tests()
        {
            // Arrange 


            List<Item> lines = ArrageLinesForFilterMethods();
            Item line = lines.Where(x => x.ID == "100").FirstOrDefault();
            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapShipments" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { line, lines });

            // Assert
            Assert.NotNull(line);
        }

        [Fact]
        public void MapMultipleShipments_Tests()
        {
            // Arrange 

            List<Item> lines = ArrageLinesForFilterMethods();
            Item line = lines.Where(x => x.ID == "300").FirstOrDefault();

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapShipments" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { line, lines });

            // Assert
            Assert.NotNull(line);
        }

        [Fact]
        public void MapSerials_Tests()
        {
            // Arrange 

            List<Item> lines = ArrageLinesForFilterMethods().Where(x => x.Parent == "100").ToList();
            Item line = ArrageLinesForFilterMethods().Where(x => x.ID == "100").FirstOrDefault();

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapSerials" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { line, lines });

            // Assert
            Assert.NotNull(line);
        }

        [Fact]
        public void MapInvoices_Tests()
        {
            // Arrange 

            List<Item> lines = ArrageLinesForFilterMethods().Where(x => x.Parent == "300").ToList();
            Item line = ArrageLinesForFilterMethods().Where(x => x.ID == "300").FirstOrDefault();

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapInvoices" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { line, lines });

            // Assert
            Assert.NotNull(line);
        }

        private static List<Item> ArrageLinesForFilterMethods()
        {
            var invoices = new List<InvoiceModel>();

            invoices.Add(new InvoiceModel
            {
                ID = "800123455",
                Line = "100",
                Quantity = 5,
                Price = 101.00M
            });

            var invoices1 = new List<InvoiceModel>();
            invoices1.Add(new InvoiceModel
            {
                ID = "800123456",
                Line = "101",
                Quantity = 5,
                Price = 101.00M
            });

            invoices1.Add(new InvoiceModel
            {
                ID = "800123455",
                Line = "100",
                Quantity = 5,
                Price = 101.00M
            });

            var shipments = new List<ShipmentModel>();
            shipments.Add(new ShipmentModel
            {
                TrackingNumber = "123123123234234",
                Carrier = "FedEx",
                Date = DateTime.Now,
                ServiceLevel = "OT"
            });
            shipments.Add(new ShipmentModel
            {
                TrackingNumber = "KCF234234234234",
                Carrier = "AIG",
                Date = DateTime.Now,
                ServiceLevel = "OT"
            });

            var shipments1 = new List<ShipmentModel>();
            shipments1.Add(new ShipmentModel
            {
                TrackingNumber = "XYZ234234234234",
                Carrier = "UPS",
                Date = DateTime.Now,
                ServiceLevel = "OT"
            });
            var shipments2 = new List<ShipmentModel>();
            shipments2.Add(new ShipmentModel
            {
                TrackingNumber = "USPS234234234",
                Carrier = "USPS",
                Date = DateTime.Now,
                ServiceLevel = "OT"
            });
            // Line Items 
            List<Item> lstLines = new List<Item>();
            Item line = new()
            {
                Parent = "0",
                ID = "100",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                POSType = "AH",
                Invoices = invoices,
                Serials = new List<string> { "1", "2", "3" }
            };

            Item line1 = new()
            {
                Parent = "100",
                ID = "101",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "AI",
                TotalPrice = (decimal?)12.08,
                Invoices = invoices1,
                Shipments = shipments,
                Serials = new List<string> { "1", "2", "5", "3" }
            };

            Item line2 = new()
            {
                Parent = "0",
                ID = "200",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KH",
                TotalPrice = (decimal?)12.08,
            };

            Item line3 = new()
            {
                Parent = "0",
                ID = "300",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                POSType = "AH",
                Shipments = shipments2,
                Invoices = invoices,
                Serials = new List<string> { "1", "2", "3" }
            };
            Item line4 = new()
            {
                Parent = "300",
                ID = "301",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "AI",
                TotalPrice = (decimal?)12.08,
                Shipments = shipments,
                Invoices = invoices,
                Serials = new List<string> { "4", "5", "3" }
            };
            Item line5 = new()
            {
                Parent = "300",
                ID = "302",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "AI",
                TotalPrice = (decimal?)12.08,
                Shipments = shipments1,
                Invoices = invoices1,
                Serials = new List<string> { "4", "5", "3", "6" }
            };
            Item line6 = new()
            {
                Parent = "200",
                ID = "201",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                POSType = "KC"
            };
            Item line7 = new()
            {
                Parent = "200",
                ID = "202",
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KC",
                TotalPrice = (decimal?)12.08,
            };

            lstLines.Add(line);
            lstLines.Add(line1);
            lstLines.Add(line2);
            lstLines.Add(line3);
            lstLines.Add(line4);
            lstLines.Add(line5);
            lstLines.Add(line6);
            lstLines.Add(line7);

            return lstLines;
        }

        [Fact]
        public void FilterOrderLinesSysyem3_Tests()
        {
            // Arrange 

            List<Item> lstLines = ArrageLinesForFilterMethods();


            Models.Order.Internal.OrderModel order = new()
            {
                Source = new() { ID = "I009092146", SalesOrg = "0100", System = "3" },
                Items = lstLines
            };

            // Act         

            var result = GetHelperService().FilterOrderLines(order);

            // Assert
            Assert.NotNull(result);
        }
        [Fact]
        public void FilterOrderLinesSysyem2_Tests()
        {
            // Arrange 

            List<Item> lstLines = ArrageLinesForFilterMethods();


            Models.Order.Internal.OrderModel order = new()
            {
                Source = new() { ID = "I009092146", SalesOrg = "0100", System = "2" },
                Items = lstLines
            };

            // Act         

            var result = GetHelperService().FilterOrderLines(order);

            // Assert
            Assert.NotNull(result);
        }
        private Item ItemModel()
        {
            Item line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                OtherFees = 12.57M,
                Freight = 35.79M,
                Tax = 41.89M,
                ID = "100",
                POSType = "AH"
            };


            return line;
        }
        private List<Item> ListItemModel()
        {
            var line = ItemModel();
            Item line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                OtherFees = 1.22M,
                Freight = 4.79M,
                Tax = 9.29M,
                ID = "100",
                POSType = "AI"
            };

            Item line2 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                OtherFees = 2.75M,
                Freight = 5.22M,
                Tax = 12.89M,
                ID = "102",
                POSType = "AI"
            };


            List<Item> lstItems = new List<Item>();
            lstItems.Add(line);
            lstItems.Add(line1);
            lstItems.Add(line2);

            return lstItems;
        }
        [Fact]
        public void MovePaymentInformationFreight_Tests()
        {
            // Arrange
            var Item = ItemModel();
            var lstItem = ListItemModel();

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MovePaymentInformation" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { Item, lstItem });

            // Assert
            Assert.NotNull(Item.Freight);
        }

        [Fact]
        public void MovePaymentInformationOtherFees_Tests()
        {
            // Arrange
            var Item = ItemModel();
            var lstItem = ListItemModel();

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MovePaymentInformation" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { Item, lstItem });

            // Assert
            Assert.NotNull(Item.OtherFees);
        }

        [Fact]
        public void MovePaymentInformationTax_Tests()
        {
            // Arrange
            var Item = ItemModel();
            var lstItem = ListItemModel();

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MovePaymentInformation" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { Item, lstItem });

            // Assert
            Assert.NotNull(Item.Tax);
        }

        [Fact]
        public void TestOrderLevel()
        {
            var orderLevel = GetHelperService().GetOrderType("ZZED", "ZZED");
            Assert.NotNull(orderLevel);
        }

        [Fact]
        public void TestFromDate()
        {
            //InitiateHelperService(out Type type,out object objType);
            var dateValue = new DateTime(2022, 1, 2);
            var compareDate = new DateTime(2022, 1, 2, 0, 0, 0);
            var dateOutput = (DateTime)GetHelperService().GetDateParameter(dateValue, "from");

            Assert.Equal(compareDate, dateOutput);
        }

        [Fact]
        public void TestToDate()
        {
            //InitiateHelperService(out Type type,out object objType);
            var dateValue = new DateTime(2022, 1, 7);
            var compareDate = new DateTime(2022, 1, 7, 23, 59, 59);
            var dateOutput = (DateTime)GetHelperService().GetDateParameter(dateValue, "to");

            Assert.Equal(compareDate, dateOutput);
        }

        [Fact]
        public void PopulateSavedCartLinesForQuoteRequest_Tests()
        {
            // Arrange 

            List<Common.Cart.Models.Cart.ActiveCartLineModel> items = new List<Common.Cart.Models.Cart.ActiveCartLineModel>()
            {
                new Common.Cart.Models.Cart.ActiveCartLineModel { ItemId = "100", ProductId="11357695", Quantity = 1,  ParentItemId = 0},
                new Common.Cart.Models.Cart.ActiveCartLineModel { ItemId = "200", ProductId="13303764", Quantity = 1,  ParentItemId = 0},

            };
            // Act         

            var result = GetHelperService().PopulateSavedCartLinesForQuoteRequest(items.AsReadOnly());

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void PopulateQuoteRequestLinesForAsync_Tests()
        {
            // Arrange 

            List<Common.Cart.Models.Cart.SavedCartLineModel> items = new List<Common.Cart.Models.Cart.SavedCartLineModel>()
            {
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "100", ProductId="11357695", Quantity = 1 },
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "200", ProductId="13303764", Quantity = 1 },
            };
            // Act         

            var result = GetHelperService().PopulateQuoteRequestLinesForAsync(items,null);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async System.Threading.Tasks.Task PopulateQuoteRequestLinesForAsyncError_Tests()
        {
            // Arrange 

            List<Common.Cart.Models.Cart.SavedCartLineModel> items = new List<Common.Cart.Models.Cart.SavedCartLineModel>()
            {
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "100", ProductId="1135769XX", Quantity = 1 },
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "200", ProductId="13303764", Quantity = 1 },
            };
            // Act         

            var ex = await Assert.ThrowsAsync<UIServiceException>(() => GetHelperService().PopulateQuoteRequestLinesForAsync(items, null));

            // Assert
            Assert.NotNull(ex.Message);
        }


        [Fact]
        public void BuildProductApiURL_Tests()
        {
            // Arrange
            List<Common.Cart.Models.Cart.SavedCartLineModel> items = new List<Common.Cart.Models.Cart.SavedCartLineModel>()
            {
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "100", ProductId="11357695", Quantity = 1 },
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "200", ProductId="13303764", Quantity = 1 },
            };

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildProductApiURL" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { items });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void GetLinesForQuoteRequestFromSavedAndActiveCart_Tests()
        {
            // Arrange
            List<Common.Cart.Models.Cart.SavedCartLineModel> items = new List<Common.Cart.Models.Cart.SavedCartLineModel>()
            {
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "100", ProductId="11357695", Quantity = 1 },
                new Common.Cart.Models.Cart.SavedCartLineModel {  ItemId = "200", ProductId="13303764", Quantity = 1 },
            };
            ProductData productDetails = new ProductData();
            
            ProductsModel P1 = new ProductsModel
            {
                Source = new SourceModel { ID = "11357695" },
                GlobalManufacturer = "CISCO",
                Name = "SHOW & SHARE SVR ENTERPRISE HW",
                ManufacturerPartNumber = "SNSC220-ENT-K9"
            };
            ProductsModel P2 = new ProductsModel
            {
                Source = new SourceModel { ID = "13303764" },
                GlobalManufacturer = "CISCOC",
                Name = "ONE DNA ADVANTAGE ONPREM LIC 100M 3YR",
                ManufacturerPartNumber = "C1DNA-P-100M-A-3Y"
            };
            ProductsModel[] Data = { P1, P2};
            productDetails.Data = Data;

            // Act
            Type type;
            object objType;
            InitiateHelperService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetLinesForQuoteRequestFromSavedAndActiveCart" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { items, productDetails, null });

            // Assert
            Assert.NotNull(result);
        }
        
        [Fact]
        public void MapAnnuityForQuotePreviw_Tests()
        {
            // Arrange 
            IEnumerable<DetailedDto> data = new List<DetailedDto>();
            QuotePreview quotePreview = new QuotePreview();
           
            // Act         
            var result = GetHelperService().MapAnnuityForQuotePreviw(data, quotePreview);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void NullableTryParseDouble_Test()
        {
            //arrange
            string request = "2";
            double? expected = 2;


            // Act         
            var result = GetHelperService().NullableTryParseDouble(request);

            // Assert
            Assert.Equal(expected, result);
        }


        [Fact]
        public void NullableTryParseDoubleFail_Test()
        {
            //arrange
            string request = "";
            double? expected = 2;

            // Act         
            var result = GetHelperService().NullableTryParseDouble(request);

            // Assert
            Assert.NotEqual(expected, result);
        }

    }
}
