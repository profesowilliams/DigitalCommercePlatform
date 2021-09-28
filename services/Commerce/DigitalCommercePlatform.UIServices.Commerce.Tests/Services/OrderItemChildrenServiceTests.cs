//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderDetails;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
   public class OrderItemChildrenServiceTests
    {

        [Fact(DisplayName = "Lines are empty for invalid input")]
        public void LinesAreEmptyForInvalidInput()
        {
            var substringService = new SubstringService();
            var sut = new OrderItemChildrenService(substringService);
            var result = sut.GetOrderLinesWithChildren(null);

            Assert.Empty(result);
        }

        [Fact(DisplayName = "Children lines are generated")]
        public void ChildrenLinesAreGenerated()
        {
            var substringService = new SubstringService();
            var sut = new OrderItemChildrenService(substringService);
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
    }
}
