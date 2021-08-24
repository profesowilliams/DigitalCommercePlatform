//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IQuoteItemChildrenService
    {
        List<Line> GetQuoteLinesWithChildren(QuotePreviewModel quotePreviewModel);
    }
}
