using DigitalCommercePlatform.UIService.Product.Models.Search;
using System.ServiceModel;

namespace DigitalCommercePlatform.UIService.Product.Service
{
    [ServiceContract]
    public interface ITypeAheadSuggestionService
    {
        [OperationContract]
        TypeAheadResponse GetTypeAheadSuggestions(TypeAheadRequest request);
    }
}