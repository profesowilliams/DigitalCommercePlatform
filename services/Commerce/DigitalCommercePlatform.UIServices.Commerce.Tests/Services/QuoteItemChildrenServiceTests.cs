//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class QuoteItemChildrenServiceTests
    {
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
            Assert.Equal(3, result[0].Children.Count);
            Assert.Equal(4, result[1].Children.Count);
        }
    }
}
