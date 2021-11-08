//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals
{
    [ExcludeFromCodeCoverage]
    public sealed class SearchRefainmentGroup
    {
        public class Request : IRequest<Response>
        {
            public string EndUserEmail { get; set; }
            public string SortBy { get; set; }
            public bool SortAscending { get; set; }
            public int Page { get; set; } = 1;
            public int PageSize { get; set; } = 25;
            public bool WithPaginationInfo { get; set; } = true;
            public List<string> VendorID { get; set; }
            public List<string> VendorName { get; set; }
            public List<string> DUNS { get; set; }
            public List<string> VATNumber { get; set; }
            public List<string> VendorAccountName { get; set; }
            public List<string> VendorAccountNumber { get; set; }
            public string EndUserType { get; set; }
            public string ProgramName { get; set; }
            public string ResellerPO { get; set; }
            public string ContractID { get; set; }
            public bool Details { get; set; }
        }

        public class Response
        {
            public RefinementGroupsModel RefinementGroups { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class GetRenewalsHandler : IRequestHandler<Request, Response>
        {
            private readonly IRenewalService _renewalsService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetRenewalsHandler> _logger;
            public GetRenewalsHandler(IRenewalService renewalsService, IMapper mapper, ILogger<GetRenewalsHandler> logger)
            {
                _renewalsService = renewalsService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                RefinementGroupsModel renewalsResponse = await _renewalsService.GetRefainmentGroup(request);

                var response = new Response
                {
                    RefinementGroups = renewalsResponse
                };
                return response;
            }
            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                }
            }
        }
    }
}
