using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;
using System.Text;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIService.Product.Models.Search;

namespace DigitalCommercePlatform.UIService.Product.Service
{
    [ServiceContract]
    public interface ITypeAheadSuggestionService
    {
        [OperationContract]
        TypeAheadResponse GetTypeAheadSuggestions(TypeAheadRequest request);

        //[OperationContract]
        //TypeAheadResponseV2 GetTypeAheadSuggestionsV2(TypeAheadRequest request);
    }
}
