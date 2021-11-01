//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class OrderItemChildrenServiceTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<HelperService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        public OrderItemChildrenServiceTests()
        {
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<HelperService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
        }

        [Fact(DisplayName = "Lines are empty for invalid input")]
        public void LinesAreEmptyForInvalidInput()
        {
            var substringService = new SubstringService();
            HelperService helperService = new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object);
            var sut = new OrderItemChildrenService(substringService, helperService);
            var result = sut.GetOrderLinesWithChildren(null);

            Assert.Empty(result);
        }

        [Fact(DisplayName = "Children lines are generated")]
        public void ChildrenLinesAreGenerated()
        {
            var substringService = new SubstringService();
            HelperService helperService = new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object);
            var sut = new OrderItemChildrenService(substringService, helperService);
            var orderModel = new OrderDetailModel
            {

                Lines = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = "0" },
                        new Models.Line { Id = "1.1", Parent = "3232" },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = "0" },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }
            };
            var orderPreviewModel = new GetOrder.Response(orderModel);


            var result = sut.GetOrderLinesWithChildren(orderPreviewModel);

            Assert.Equal(2, result.Count);
        }
        
        [Fact(DisplayName = "Subline Tracking Info is returned")]
        public void GetSubLineTracking_Test()
        {
            var substringService = new SubstringService();
            HelperService helperService = new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object);
            var sut = new OrderItemChildrenService(substringService, helperService);
            Type type;
            object objType;
            InitiateOrderItemChildrenService(out type, out objType);

            var getSublineTrackingMethod = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "GetSubLineTracking" && x.IsPrivate);

            var orderModel = new OrderDetailModel
            {

                Lines = new List<Models.Line>
                    {
                        new Models.Line
                        {
                            Id = "1.0",
                            Parent = "0",
                            Trackings = new List<TrackingDetails>{
                                new TrackingDetails
                                {
                                    Carrier = "UPS",
                                    Date = System.DateTime.Now,
                                    OrderNumber = "12345",
                                    ID = "001"
                                }
                            }
                        },
                        new Models.Line 
                        { 
                            Id = "1.1",
                            Parent = "1.0",
                            Trackings = new List<TrackingDetails>{
                                new TrackingDetails
                                {
                                    Carrier = "Fedex",
                                    Date = System.DateTime.Now,
                                    OrderNumber = "12345",
                                    ID = "005"
                                }
                            }
                        },
                        new Models.Line { Id = "1.2", Parent = "1.0" },
                        new Models.Line { Id = "1.0.1", Parent = "1,0" },
                        new Models.Line { Id = "2.0", Parent = "0" },
                        new Models.Line { Id = "2.10", Parent = "2.0" },
                        new Models.Line { Id = "2.0.1", Parent = "2,0" },
                        new Models.Line { Id = "2.2", Parent = "2.0" },
                        new Models.Line { Id = "2.5", Parent = "2.0" }
                    }
            };

            var result = (List<TrackingDetails>)getSublineTrackingMethod
                .Invoke(objType, new object[] { orderModel.Lines.Where(x => x.Parent == "1.0").ToList() });

            var line = orderModel.Lines.Single(line => line.Id == "1.0");
            line.Trackings?.AddRange(result);

            Assert.Single<TrackingDetails>(result);
            Assert.Equal(2, line.Trackings.Count);
        }

        private void InitiateOrderItemChildrenService(out Type type, out object objType)
        {
            type = typeof(OrderItemChildrenService);
            objType = Activator.CreateInstance(type,
                new SubstringService(),
                new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object)
            );
        }

    }
}
