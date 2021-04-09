using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewals.Models;
using DigitalCommercePlatform.UIServices.Renewals.Services;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Actions.GetSummary
{
    public sealed class GetRenewalsSummary
    {

        public class Request : IRequest<Response>
        {
            public string Criteria { get; set; }
        }

        public class Response
        {
            public RenewalsSummaryModel Summary { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(RenewalsSummaryModel summary)
            {
                Summary = summary;
            }
        }
        public class GetRenewalsSummaryQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IRenewalsQueryServices _renewalsQueryService;
            private readonly IMapper _mapper;

            public GetRenewalsSummaryQueryHandler(IRenewalsQueryServices renewalsQueryService, IMapper mapper)
            {
                _renewalsQueryService = renewalsQueryService;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var summary = await _renewalsQueryService.GetRenewalsSummaryAsync(request.Criteria);
                    //var renewals = _mapper.Map<IEnumerable<Renewal>>(renewalsDto?.ListOfRenewals);
                    //// business logic goes here or create private method
                   
                    var response = new Response(summary);
                    response.IsError = false;
                    response.ErrorCode = string.Empty;
                    return response;
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                
            }

        }



    }
}