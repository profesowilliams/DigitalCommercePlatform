using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogueDetails
{
    public class GetCatalogueHandler :IRequestHandler<GetCatalogueRequest, GetCatalogueResponse>
    {
        private readonly IBrowseService _catalogueRepositoryServices;
        private readonly IMapper _mapper;

        public GetCatalogueHandler(IBrowseService catalogueRepositoryServices, IMapper mapper)
        {
            _catalogueRepositoryServices = catalogueRepositoryServices;
            _mapper = mapper;
        }

        public async Task<GetCatalogueResponse> Handle(GetCatalogueRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var CatalogueDetails = await _catalogueRepositoryServices.GetCatalogueDetails(request);
                var getCatalogueResponse = _mapper.Map<GetCatalogueResponse>(CatalogueDetails);
                return getCatalogueResponse;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            
        }
    }
}
