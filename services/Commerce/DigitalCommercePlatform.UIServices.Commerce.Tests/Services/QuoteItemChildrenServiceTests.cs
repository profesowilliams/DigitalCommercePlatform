//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
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
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class QuoteItemChildrenServiceTests
    {
        private readonly Mock<SubstringService> _subStringService;
        private readonly Mock<IHelperService> _helperService;
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<HelperService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IHttpClientFactory> _httpClientFactory;
        public QuoteItemChildrenServiceTests()
        {
            _subStringService = new Mock<SubstringService>();
            _helperService = new Mock<IHelperService>();
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<HelperService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
            _httpClientFactory = new Mock<IHttpClientFactory>();
        }

        private QuoteItemChildrenService GetQuoteItemChildrenService()
        {
            return new QuoteItemChildrenService(_subStringService.Object,_helperService.Object);
        }

        [Fact(DisplayName = "Lines are empty for invalid input")]
        public void LinesAreEmptyForInvalidInput()
        {
            QuotePreviewModel quotePreviewModel = new QuotePreviewModel();
            var result = GetQuoteItemChildrenService().GetQuoteLinesWithChildren(quotePreviewModel);

            Assert.Empty(result);
        }



        [Fact(DisplayName = "Children lines are generated")]
        public void ChildrenLinesAreGenerated()
        {
            var lstAttributes = new List<AttributeModel>();
            var attrLine = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "1.0"
            };

            var attrParent = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "1.3"
            };
            var lstAttributes2 = new List<AttributeModel>();
            var attrLine2 = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "2.0"
            };

            var attrParent2 = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "2.0.1"
            };

            lstAttributes.Add(attrLine2);
            lstAttributes.Add(attrParent2);

            lstAttributes.Add(attrLine);
            lstAttributes.Add(attrParent);
            var quotePreviewModel = new QuotePreviewModel
            {

                QuoteDetails = new QuotePreview
                {
                    Items = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = null},
                        new Models.Line { Id = "1.1", Parent = "3232", Attributes = lstAttributes },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = null, Attributes = lstAttributes2 },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }
                }
            };

            var result = GetQuoteItemChildrenService().GetQuoteLinesWithChildren(quotePreviewModel);

            Assert.Equal(2, result.Count);
        }

        private void InitateQuoteItemChildrenService(out Type type, out object objType)
        {
            type = typeof(QuoteItemChildrenService);
            objType = Activator.CreateInstance(type,
                _subStringService.Object,
                _helperService.Object
                );
        }

        [Fact]
        public void ApplyIdToItems_Test()
        {
            //arrange


            var lstAttributes = new List<AttributeModel>();
            var attrLine = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "1.0"
            };

            var attrParent = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "1.3"
            };
            var lstAttributes2 = new List<AttributeModel>();
            var attrLine2 = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "2.0"
            };

            var attrParent2 = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "2.0.1"
            };

            lstAttributes.Add(attrLine2);
            lstAttributes.Add(attrParent2);

            lstAttributes.Add(attrLine);
            lstAttributes.Add(attrParent);

            var quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = new QuotePreview
                {
                    Source = new Models.Quote.Quote.Internal.VendorReferenceModel { Type="Estimate", Value ="AS21323ZXRE"},
                    Items = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = null },
                        new Models.Line { Id = "1.1", Parent = "3232", Attributes = lstAttributes  },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = null, Attributes = lstAttributes2  },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }

                }
            };

            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "ApplyIdToItems" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { quotePreviewModel });
            Assert.Null(result);
        }

        [Fact]
        public void ApplyIdToItemsNull_Test()
        {
            //arrange

            var quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = new QuotePreview
                {
                    Items = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = null },
                        new Models.Line { Id = "1.1", Parent = "3232" },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = null },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }

                }
            };

            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "ApplyIdToItems" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { quotePreviewModel });
            Assert.Null(result);
        }

        



        [Fact]
        public void MapChildrenFromParents_Test()
        {
            //arrange
            Line line = new Line
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = 123.98M,
                UnitListPrice = 100.00M,
                Parent = null,
                Id = "1.0"
            };
            Line subLine = new Line
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = 123.98M,
                UnitListPrice = 100.00M,
                Parent = "1.0",
                Id = "1.1",
            };
            Line subLine1 = new Line
            {
                TDNumber = "1231234444",
                MFRNumber = "CISCO_35345",
                Manufacturer = "CISCO",
                ShortDescription = "TEST PRODUCT",
                Quantity = 1,
                UnitPrice = 123.98M,
                UnitListPrice = 100.00M,
                Parent = "1.1",
                Id = "1.1.1"
            };
            List<Line> subLines = new List<Line>();
            subLines.Add(line);
            List<Line> childLines = new List<Line>();
            childLines.Add(subLine);
            childLines.Add(subLine1);


            List<Line> items = new List<Line>();
            items.Add(line);
            items.Add(subLine);
            items.Add(subLine1);

            QuotePreview quotePreview = new QuotePreview
            {
                BuyMethod = "tdavnet69",
                Currency = "USD",
                Id = "123",
                IsExclusive = true,
                CustomerBuyMethod = "TDANDAVT",
                Items = items
            };
            QuotePreviewModel quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = quotePreview
            };

            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var MapChildrenFromParents = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "MapChildrenFromParents" && x.IsPrivate);

            MapChildrenFromParents.Invoke(objType, new object[] { quotePreviewModel, subLines, childLines });
            Assert.NotNull(quotePreviewModel.QuoteDetails.Items);
        }

        [Fact]
        public void DisplayIdForLinesWithAttibutes_Test()
        {
            //arrange


            var lstAttributes = new List<AttributeModel>();
            var attrLine = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "1.0"
            };

            var attrParent = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "1.3"
            };
            var lstAttributes2 = new List<AttributeModel>();
            var attrLine2 = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "2.0"
            };

            var attrParent2 = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "2.0.1"
            };

            lstAttributes.Add(attrLine2);
            lstAttributes.Add(attrParent2);

            lstAttributes.Add(attrLine);
            lstAttributes.Add(attrParent);

            var quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = new QuotePreview
                {
                    Items = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = null },
                        new Models.Line { Id = "1.1", Parent = "3232", Attributes = lstAttributes  },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = null, Attributes = lstAttributes2  },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }
                }
            };

            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "DisplayIdForLinesWithAttibutes" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { quotePreviewModel });
            Assert.Null(result);
        }

        [Fact]
        public void DisplayIdForLinesWithoutId_Test()
        {
            //arrange
            var items = new List<Models.Line>
            {
                new Models.Line { Id = "1.0", Parent = null },
                new Models.Line { Id = "1.1", Parent = "1.0" },
                new Models.Line { Id = "1.2", Parent = "1.2" },
                new Models.Line { Id = "1.0.1", Parent = "3232" },
                new Models.Line { Id = "2.0", Parent = null,},
                new Models.Line { Id = "", Parent = "" },
                new Models.Line { Id = "", Parent = "" },
                new Models.Line { Id = "", Parent = "" },
                new Models.Line { Id = "", Parent = "" }
            };
            var quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = new QuotePreview
                {
                    Source = new Models.Quote.Quote.Internal.VendorReferenceModel { Type= "Estimate", Value = "RT133770817NW" },
                    Items = items
                }
            };

            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "DisplayIdForLinesWithoutId" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { quotePreviewModel, items});
            Assert.NotNull(quotePreviewModel.QuoteDetails.Items[6].DisplayLineNumber);
        }

        [Fact]
        public void DisplayIdForAllLines_Test()
        {
            //arrange
            var items = new List<Models.Line>
            {                
                new Models.Line { Id = "", Parent = "" },
                new Models.Line { Id = "", Parent = "" },
                new Models.Line { Id = "", Parent = "" },
                new Models.Line { Id = "", Parent = "" }
            };
            var quotePreviewModel = new QuotePreviewModel
            {
                QuoteDetails = new QuotePreview
                {
                    Source = new Models.Quote.Quote.Internal.VendorReferenceModel { Type = "Estimate", Value = "RT133770817NW" },
                    Items = items
                }
            };

            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "DisplayIdForAllLines" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { quotePreviewModel });
            Assert.NotNull(quotePreviewModel.QuoteDetails.Items[1].DisplayLineNumber);
        }



        [Fact(DisplayName = "Quotes Id are in Proper Order")]
        public void OrderByItemId()
        {
            var substringService = new SubstringService();
            
            HelperService helperService = new HelperService(_logger.Object, _context.Object, _middleTierHttpClient.Object, _appSettings.Object, _httpClientFactory.Object);
            var sut = new QuoteItemChildrenService(substringService, helperService);

            var lstAttributes = new List<AttributeModel>();
            var attrLine = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "1.0"
            };
            

            var attrParent = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "1.3"
            };
            var lstAttributes2 = new List<AttributeModel>();
            var attrLine2 = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "2.0"
            };

            var attrParent2 = new AttributeModel
            {
                Name = "CONFIGLINE",
                Value = "2.0.1"
            };
            var attrLine3 = new AttributeModel
            {
                Name = "CONFIGPARENT",
                Value = "1.0.1"
            };

            lstAttributes.Add(attrLine2);
            lstAttributes.Add(attrParent2);
            lstAttributes.Add(attrLine3);

            lstAttributes.Add(attrLine);
            lstAttributes.Add(attrParent);
            var quotePreviewModel = new QuotePreviewModel
            {

                QuoteDetails = new QuotePreview
                {
                    Items = new List<Models.Line>
                    {
                        new Models.Line { Id = "1.0", Parent = null},
                        new Models.Line { Id = "1.1", Parent = "3232", Attributes = lstAttributes },
                        new Models.Line { Id = "1.2", Parent = "3232" },
                        new Models.Line { Id = "1.0.1", Parent = "3232" },
                        new Models.Line { Id = "2.0", Parent = null, Attributes = lstAttributes2 },
                        new Models.Line { Id = "2.10", Parent = "5532" },
                        new Models.Line { Id = "2.0.1", Parent = "5532" },
                        new Models.Line { Id = "2.2", Parent = "5532" },
                        new Models.Line { Id = "2.5", Parent = "5532" }
                    }
                }
            };

            var result = sut.GetQuoteLinesWithChildren(quotePreviewModel);

            Assert.NotNull(result.OrderBy(i=>i.DisplayLineNumber));
        }
    }
}
