using MediatR;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails
{
    public class GetCatalogueRequest : IRequest<GetCatalogueResponse>
    {
        public string Id { get; set; }

        public GetCatalogueRequest(string catalogueId)
        {
            Id = catalogueId;
        }
    }
}
