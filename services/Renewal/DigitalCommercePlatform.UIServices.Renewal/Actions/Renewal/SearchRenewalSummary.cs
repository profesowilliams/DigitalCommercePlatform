//2021 (c) Tech Data Corporation -. All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Cache.UI;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Services.Actions.Abstract;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal
{
    [ExcludeFromCodeCoverage]
    public sealed class SearchRenewalSummary
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
            public bool Details { get; set; }
            public string SessionId { get; set; }
            public string ResellerName { get; set; }
            public List<string> Type { get; internal set; }
            public List<string> ResellerId { get; internal set; }
            public DateTime? CreatedFrom { get; set; }
            public DateTime? CreatedTo { get; set; }
            public DateTime? ExpiresFrom { get; set; }
            public DateTime? ExpiresTo { get; set; }
            public DateTime? DueDate { get; set; }

        }

        public class Response
        {
            public List<SummaryModel> Items { get; set; }
            public RefinementGroupsModel RefinementGroups { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class GetRenewalsHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IRenewalService _renewalsService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetRenewalsHandler> _logger;
            private readonly IUIContext _context;
            private readonly string _homeAccount;
            private readonly ISessionIdBasedCacheProvider _sessionIdBasedCacheProvider;
            private readonly int _cacheExpiration;

            public GetRenewalsHandler(IRenewalService renewalsService,
                IMapper mapper,
                ILogger<GetRenewalsHandler> logger,
                IUIContext context, ISessionIdBasedCacheProvider sessionIdBasedCacheProvider,
                IAppSettings appSettings
                )
            {
                _renewalsService = renewalsService;
                _mapper = mapper;
                _logger = logger;
                _context = context;
                _homeAccount = appSettings.GetSetting("UI.Renewal.HouseAccount");
                _cacheExpiration = int.Parse(appSettings.GetSetting("Cache.DefaultExpirationTimeInSec"));
                _sessionIdBasedCacheProvider = sessionIdBasedCacheProvider;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                List<SummaryModel> renewalsResponse = await _renewalsService.GetRenewalsSummaryFor(request);
                RefinementGroupsModel refainmentGroup = new RefinementGroupsModel();
                if(_homeAccount != _context.ImpersonatedAccount)
                {
                    refainmentGroup = _sessionIdBasedCacheProvider.Get<RefinementGroupsModel>(request.SessionId);
                    if (refainmentGroup == null)
                    {
                        refainmentGroup = await _renewalsService.GetRefainmentGroup(new RefinementRequest() { Type = "Renewal" }).ConfigureAwait(false);
                        _sessionIdBasedCacheProvider.Put(request.SessionId, refainmentGroup, _cacheExpiration);
                    }
                }
                var response = new Response
                {
                    Items = renewalsResponse,
                    RefinementGroups = refainmentGroup
                };
                return new ResponseBase<Response> { Content = response };
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
