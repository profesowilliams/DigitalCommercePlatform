using DigitalFoundation.App.Services.Quote.Models.Quote;
using DigitalFoundation.Core.Models.DTO.Common;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Quote.Models
{
    public class TdQuotesForGrid : PaginatedResponse<IEnumerable<QuoteModel>>
    {
    }
}
