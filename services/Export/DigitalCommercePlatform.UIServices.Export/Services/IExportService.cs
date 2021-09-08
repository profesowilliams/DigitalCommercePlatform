//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    public interface IExportService
    {
        Task<byte[]> GetQuoteDetailsAsXls(QuoteDetails quoteDetails, IFormFile logo);
    }
}
