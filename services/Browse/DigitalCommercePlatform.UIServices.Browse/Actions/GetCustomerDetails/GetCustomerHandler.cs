using System;
using MediatR;
using AutoMapper;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Browse.Services;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails
{
    public class GetCustomerHandler :IRequestHandler<GetCustomerRequest, GetCustomerResponse>
    {
        private readonly IBrowseService _customerRepositoryServices;
        private readonly IMapper _mapper;

        public GetCustomerHandler(IBrowseService customerRepositoryServices, IMapper mapper)
        {
            _customerRepositoryServices = customerRepositoryServices;
            _mapper = mapper;
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
                throw ex;
            }
          
        }
    }
}

