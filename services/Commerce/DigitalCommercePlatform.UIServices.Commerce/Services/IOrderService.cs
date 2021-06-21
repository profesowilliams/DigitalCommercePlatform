using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface IOrderService
    {
        Task<byte[]> GetPdfInvoiceAsync(string invoiceId);
        Task<List<InvoiceModel>> GetInvoicesFromOrderIdAsync(string orderId);
    }
}
