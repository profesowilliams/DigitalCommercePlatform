using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewals.Models;
using DigitalCommercePlatform.UIServices.Renewals.Services;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Actions.GetRenewals
{
    public sealed class GetMultipleRenewals
    {

        public class Request : IRequest<Response>
        {
            public FindModel Criteria { get; set; }
        }

        public class Response
        {
            public RenewalsModel Content { get; set; }
            public virtual bool IsError { get; set; }
            public string ErrorCode { get; set; }

            public Response(RenewalsModel records)
            {
                Content = records;
            }
        }
        public class GetRenewalsQueryHandler : IRequestHandler<Request, Response>
        {
            private readonly IRenewalsQueryServices _renewalsQueryService;
            private readonly IMapper _mapper;

            public GetRenewalsQueryHandler(IRenewalsQueryServices renewalsQueryService, IMapper mapper)
            {
                _renewalsQueryService = renewalsQueryService;
                _mapper = mapper;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var renewalsDto = await _renewalsQueryService.GetRenewalsAsync(request);
                var renewals = _mapper.Map<IEnumerable<Renewal>>(renewalsDto?.ListOfRenewals);
                // business logic goes here or create private method
                var model = new RenewalsModel
                {
                    ListOfRenewals = renewals.ToList(),
                    SortBy = request.Criteria.SortBy,
                    TotalRecords = renewals.Count(),
                    CurrentPage = 1
                };
                return new Response(model);
            }

        }



    }
}

