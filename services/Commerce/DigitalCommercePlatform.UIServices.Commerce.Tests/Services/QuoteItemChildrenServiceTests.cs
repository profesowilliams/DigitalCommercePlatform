//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class QuoteItemChildrenServiceTests
    {
        private readonly Mock<SubstringService> _subStringService;
        public QuoteItemChildrenServiceTests()
        {
            _subStringService = new Mock<SubstringService>();
        }
        [Fact(DisplayName = "Lines are empty for invalid input")]
        public void LinesAreEmptyForInvalidInput()
        {
            var substringService = new SubstringService();
            var sut = new QuoteItemChildrenService(substringService);
            var result = sut.GetQuoteLinesWithChildren(null);

            Assert.Empty(result);
        }



        [Fact(DisplayName = "Children lines are generated")]
        public void ChildrenLinesAreGenerated()
        {
            var substringService = new SubstringService();
            var sut = new QuoteItemChildrenService(substringService);

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
            
            var result = sut.GetQuoteLinesWithChildren(quotePreviewModel);

            Assert.Equal(2, result.Count);
        }

        private void InitateQuoteItemChildrenService(out Type type, out object objType)
        {
            type = typeof(QuoteItemChildrenService);
            objType = Activator.CreateInstance(type,
                _subStringService.Object
                );
        }

        [Fact]
        public void ApplyIdToItems_Test()
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
        public void NullableTryParseDouble_Test()
        {
            //arrange
            string request = "2";
            double? expected = 2;
            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "NullableTryParseDouble" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { request });
            Assert.Equal(expected, result);
        }


        [Fact]
        public void NullableTryParseDoubleFail_Test()
        {
            //arrange
            string request = "";
            double? expected = 2;
            Type type;
            object objType;
            InitateQuoteItemChildrenService(out type, out objType);

            var queryLine = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "NullableTryParseDouble" && x.IsPrivate);

            var result = queryLine.Invoke(objType, new object[] { request });
            Assert.NotEqual(expected, result);
        }
    }
}
