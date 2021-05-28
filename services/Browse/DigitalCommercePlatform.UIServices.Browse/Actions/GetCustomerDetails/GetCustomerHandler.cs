using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Browse.Services;
using MediatR;
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
        public class Request : IRequest<ResponseBase<Response>>
        {

        }

        public class Response
        {
            public string ID { get; set; }
            public string Name { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IBrowseService _customerRepositoryServices;
            private readonly IMapper _mapper;

            public Handler(IBrowseService customerRepositoryServices,
                IMapper mapper)
            {
                _customerRepositoryServices = customerRepositoryServices;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                    var customerDetails = await _customerRepositoryServices.GetCustomerDetails();
                    var getCustomerResponse = _mapper.Map<IEnumerable<Response>>(customerDetails)?.FirstOrDefault();
                    return new ResponseBase<Response> { Content = getCustomerResponse };
            }
        }
    }
}