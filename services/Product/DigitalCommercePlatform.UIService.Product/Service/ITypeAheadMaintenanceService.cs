using DigitalCommercePlatform.UIService.Product.Models.Search;
using System.ServiceModel;

namespace DigitalCommercePlatform.UIService.Product.Service
{
    [ServiceContract]
    public interface ITypeAheadMaintenanceService
    {
        [OperationContract]
        RecordsUpdatedOutput PopulateKeywordSuggestions(PopulateKeywordSuggestionInput input);

        [OperationContract]
        RecordsUpdatedOutput PopulateKeywordSuggestionRefinements(PopulateKeywordRefinementSuggestionInput input);

        [OperationContract]
        RecordsUpdatedOutput DeleteUnmatchedKeywords(string searchApplication);

        [OperationContract]
        void PurgeData();
    }
}