using DigitalCommercePlatform.UIService.Product.Actions.Product;
using DigitalCommercePlatform.UIService.Product.Dto;
using DigitalCommercePlatform.UIService.Product.Dto.Find;
using DigitalCommercePlatform.UIService.Product.Dto.GetProduct;
using DigitalCommercePlatform.UIService.Product.Dto.GetProductMultiple;
using DigitalCommercePlatform.UIService.Product.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.HttpClients
{
    public interface IProductClient
    {
        Task<CoreProductModel> GetAsync(GetProductDetailCriteriaDto query);
        Task<IEnumerable<ProductDetailDto>> GetMultipleAsync(GetProductMultipleCriteriaDto query);
        Task<CoreProductSummaryModel> GetSummaryAsync(string id);
        Task<IDictionary<string, CoreProductSummaryModel>> GetSummaryMultipleAsync(string[] ids);
        Task<FindProduct.FindProductResponse> Find(CriteriaDto query);
    }
}
