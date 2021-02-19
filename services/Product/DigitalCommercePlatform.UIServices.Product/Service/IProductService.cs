using System.Threading.Tasks;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.FindProduct.FindProductHandler;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.FindSummarySearch.FindSummaryHandler;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.GetProductDetails.GetProductDetailsHandler;
using static DigitalCommercePlatform.UIServices.Product.Actions.Product.GetProductSummary.GetProductSummaryHandler;

namespace DigitalCommercePlatform.UIServices.Product.Services
{
    public interface IProductService
    {
        Task<GetProductResponse> FindProductdetials(GetProductRequest request);
        Task<FindSummaryResponse> FindSummarydetials(FindSummaryRequest request);
        Task<GetProductDetailsResponse> GetProductdetials(GetProductDetailsRequest request);
        Task<GetProductSummaryResponse> GetProductSummary(GetProductSummaryRequest request);
    }
}
