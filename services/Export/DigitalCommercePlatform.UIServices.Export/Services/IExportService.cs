//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    public interface IExportService
    {
        Task<byte[]> GetQuoteDetailsAsXls(QuoteDetails quoteDetails, DownloadQuoteDetails.Request request);
    }
}
