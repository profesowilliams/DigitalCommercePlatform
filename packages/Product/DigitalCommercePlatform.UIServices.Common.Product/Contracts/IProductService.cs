using DigitalCommercePlatform.UIServices.Common.Product.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Product.Contracts
{
    public interface IProductService
    {
        Task<ProductData> FindProductDetailsAsync(FindProductDto findProductDto);
        Task<SummaryDetails> FindSummaryDetailsAsync(FindProductDto findProductDto);
        Task<IEnumerable<ProductModel>> GetProductDetailsAsync(ProductDetailDto productDetailDto);
        Task<SummaryModel> GetProductSummaryAsync(ProductDetailDto productDetailDto);
    }
}