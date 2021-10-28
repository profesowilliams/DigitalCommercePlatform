//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals
{
    [ExcludeFromCodeCoverage]
    public sealed class GetRenewal
    {
        public class Request : IRequest<ResponseBase<Response>>
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

            public Request(int pageSize )
            {
                PageSize = pageSize;
            }
        }

        public class Response
        {
            public long? TotalItems { get; set; }
            public long? PageCount { get; set; }
            public int? PageNumber { get; set; }
            public int? PageSize { get; set; }
            public List<RenewalsModel> Items { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class GetRenewalsHandler : IRequestHandler<Request, ResponseBase<Response>>
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

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                List<RenewalsModel> renewalsResponse = await _renewalsService.GetRenewalsFor(request);

                var response = new Response
                {
                    TotalItems = renewalsResponse?.Count,
                    PageSize = 25,
                    PageCount = request.WithPaginationInfo ? (renewalsResponse?.Count + request.PageSize - 1) / request.PageSize : 0,
                    Items = renewalsResponse
                };
                return new ResponseBase<Response> { Content = response };
            }

            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                   // RuleFor(c => c.RenewalIdFilter).NotEmpty();
                }
            }
        }
    }
}
