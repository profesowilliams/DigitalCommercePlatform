using System.ServiceModel;
using DigitalCommercePlatform.UIService.Product.Models.Search;

namespace DigitalCommercePlatform.UIService.Product.Service
{
	[ServiceContract]
	public interface IMaterialNumberSuggestionService
	{
		[OperationContract]
		MaterialTypeAheadResponse GetTypeAheadResult(MaterialTypeAheadRequest request);
	}
}
