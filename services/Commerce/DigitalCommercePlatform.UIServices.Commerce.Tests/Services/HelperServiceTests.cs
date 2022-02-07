//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using Xunit;

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
                System = "any",
                TargetSystem = "any"
            };

            //Act
            var result = GetHelperService().GetCheckoutSystem(source);
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
            
            List<Models.Order.Internal.Item> lstLines = new List<Models.Order.Internal.Item>();
            Models.Order.Internal.Item line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,               
                TotalPrice = (decimal?)12.08,
                POSType = "KC"
            };
            Models.Order.Internal.Item line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KC",
                TotalPrice = (decimal?)12.08,
            };
            Models.Order.Internal.Item line2 = new()
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
        public void FilterOrderGATPLines_Tests()
        {
            // Arrange 

            List<Models.Order.Internal.Item> lstLines = new List<Models.Order.Internal.Item>();
            Models.Order.Internal.Item line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                POSType = "KC"
            };
            Models.Order.Internal.Item line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KC",
                TotalPrice = (decimal?)12.08,
            };
            Models.Order.Internal.Item line2 = new()
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
                .First(x => x.Name == "FilterOrderGATPLines" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { order });

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void FilterOrderLines_Tests()
        {
            // Arrange 

            List<Models.Order.Internal.Item> lstLines = new List<Models.Order.Internal.Item>();
            Models.Order.Internal.Item line = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                POSType = "KC"
            };
            Models.Order.Internal.Item line1 = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                POSType = "KC",
                TotalPrice = (decimal?)12.08,
            };
            Models.Order.Internal.Item line2 = new()
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

            var result = GetHelperService().FilterOrderLines(order);

            // Assert
            Assert.NotNull(result);
        }

        [Fact]
        public void TestOrderLevel()
        {
            var orderLevel = GetHelperService().GetOrderType("ZZED", "ZZED");
            Assert.NotNull(orderLevel);
        }

    }
}
