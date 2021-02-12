using MediatR;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    public class GetHeaderRequest : IRequest<GetHeaderResponse>
    {

        public string customerId { get; set; }
        public string userId { get; set; }
        public string catalogueCriteria { get; set; }

        public GetHeaderRequest(string CustomerId, string UserId, string CatalogueCriteria)
        {
            customerId= CustomerId;
            userId= UserId;
            catalogueCriteria= CatalogueCriteria;
        }
    }
}
