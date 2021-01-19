using DigitalCommercePlatform.UIService.Product.Models.Search;
using System.ServiceModel;

namespace DigitalCommercePlatform.UIService.Product.Service
{
    [ServiceContract]
    public interface IMaterialNumberSuggestionService
    {
        [OperationContract]
        MaterialTypeAheadResponse GetTypeAheadResult(MaterialTypeAheadRequest request);
    }
}