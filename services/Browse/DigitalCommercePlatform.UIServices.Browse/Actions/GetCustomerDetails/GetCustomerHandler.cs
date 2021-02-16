using System;
using MediatR;
using AutoMapper;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetCustomerHandler
    {
        public class GetCustomerRequest : IRequest<GetCustomerResponse>
        {
            public string id { get; set; }

            public GetCustomerRequest(string Id)
            {
                id = Id;
            }
        }
        public class GetCustomerResponse
        {
            public string ID { get; set; }
            public string Name { get; set; }
        }
        public class Handler : IRequestHandler<GetCustomerRequest, GetCustomerResponse>
        {
            private readonly IBrowseService _customerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<GetCustomerHandler> _logger;
            public Handler(IBrowseService customerRepositoryServices,
                IMapper mapper,
                ILogger<GetCustomerHandler> logger)
            {
                _customerRepositoryServices = customerRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<GetCustomerResponse> Handle(GetCustomerRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var customerDetails = await _customerRepositoryServices.GetCustomerDetails(request);
                    var getCustomerResponse = _mapper.Map<IEnumerable<GetCustomerResponse>>(customerDetails)?.FirstOrDefault();
                    return getCustomerResponse;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at setting GetCustomerHandler : " + nameof(GetCustomerHandler));
                    throw ex;
                }

            }
        }
    }
   
}

