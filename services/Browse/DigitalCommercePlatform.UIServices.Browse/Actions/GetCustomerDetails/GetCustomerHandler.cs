using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails
{
    [ExcludeFromCodeCoverage]
    public static class GetCustomerHandler
    {
        public class GetCustomerRequest : IRequest<ResponseBase<GetCustomerResponse>>
        {
            public string Id { get; set; }

            public GetCustomerRequest(string id)
            {
                Id = id;
            }
        }

        public class GetCustomerResponse
        {
            public string ID { get; set; }
            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<GetCustomerRequest, ResponseBase<GetCustomerResponse>>
        {
            private readonly IBrowseService _customerRepositoryServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IBrowseService customerRepositoryServices,
                IMapper mapper,
                ILogger<Handler> logger)
            {
                _customerRepositoryServices = customerRepositoryServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<GetCustomerResponse>> Handle(GetCustomerRequest request, CancellationToken cancellationToken)
            {
                try
                {
                    var customerDetails = await _customerRepositoryServices.GetCustomerDetails(request);
                    var getCustomerResponse = _mapper.Map<IEnumerable<GetCustomerResponse>>(customerDetails)?.FirstOrDefault();
                    return new ResponseBase<GetCustomerResponse> { Content = getCustomerResponse };
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