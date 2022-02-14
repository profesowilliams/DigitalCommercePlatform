//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Services
{
    public class CommerceServiceTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<CommerceService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IMapper> _mapper;
        private readonly ICommerceService _commerceService;
        public CommerceServiceTests()
        {
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<CommerceService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
            _mapper = new Mock<IMapper>();
            _commerceService = new CommerceService(_middleTierHttpClient.Object, _logger.Object, _appSettings.Object, _context.Object, _mapper.Object);
        }

        private void InitiateCommerceService(out Type type, out object objType)
        {
            type = typeof(CommerceService);
            objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _logger.Object,
                _appSettings.Object,
                _context.Object,
                _mapper.Object
                );
        }

        [Theory]
        [AutoDomainData]
        public async Task GetQuote(GetQuote.Request request)
        {
            // Act
            var result = await _commerceService.GetQuote(request);
            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void PopulateOrderDetails_Test()
        {
            //arrange
            var objSource = new Models.Order.Internal.Source { ID = "708546" };


            Item testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Tax = (decimal?)12.08,
                Freight = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
            };

            List<Item> lstItems = new List<Item>();
            lstItems.Add(testLine);

            Models.Order.Internal.OrderModel request = new Models.Order.Internal.OrderModel
            {
                Source = objSource,
                Items = lstItems
            };

            Type type;
            object objType;
            InitiateCommerceService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "PopulateOrderDetails" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
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

            var result = _commerceService.FilterOrderLines(order);

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

            var result = _commerceService.FilterOrderLines(order);

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
            InitiateCommerceService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "FilterOrderGATPLines" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { order });

            // Assert
            Assert.NotNull(result);
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
            InitiateCommerceService(out type, out objType);

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
            InitiateCommerceService(out type, out objType);

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
            InitiateCommerceService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MovePaymentInformation" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { Item, lstItem });

            // Assert
            Assert.NotNull(Item.Tax);
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
            InitiateCommerceService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapSerials" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { line, lines });

            // Assert
            Assert.NotNull(line);
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
            InitiateCommerceService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapShipments" && x.IsPrivate);

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
            InitiateCommerceService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapInvoices" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { line, lines });

            // Assert
            Assert.NotNull(line);
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
            InitiateCommerceService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "FilterOrderKitLines" && x.IsPrivate);

            var result = apiQuery.Invoke(objType, new object[] { order });

            // Assert
            Assert.NotNull(result);
        }
    }
}
