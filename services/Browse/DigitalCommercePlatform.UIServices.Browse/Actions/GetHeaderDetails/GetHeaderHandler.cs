using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Browse.Services;
using Microsoft.Extensions.Logging;
using System;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails
{
    public class GetHeaderHandler :IRequestHandler<GetHeaderRequest, GetHeaderResponse>
    {
        private readonly IBrowseService _headerRepositoryServices;
        private readonly IMapper _mapper;
        private readonly ILogger<GetHeaderHandler> _logger;
        public GetHeaderHandler(IBrowseService headerRepositoryServices, 
            IMapper mapper, 
            ILogger<GetHeaderHandler> logger)
        {
            _headerRepositoryServices = headerRepositoryServices;
            _logger = logger;
            _mapper = mapper;
        }

        public async Task<GetHeaderResponse> Handle(GetHeaderRequest request, CancellationToken cancellationToken)
        {
            try
            {
                var headerDetails = await _headerRepositoryServices.GetHeader(request);
                var geteaderhResponse = _mapper.Map<GetHeaderResponse>(headerDetails);
                return geteaderhResponse;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at GetHeaderHandler : " + nameof(GetHeaderHandler));
                throw;
            }
           
        }
    }
}
