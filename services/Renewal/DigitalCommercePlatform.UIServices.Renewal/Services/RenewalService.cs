//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public class RenewalService : IRenewalService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<RenewalService> _logger;
        private readonly IUIContext _uiContext;
        private readonly IMapper _mapper;
        private readonly string _appRenewalServiceUrl;
        private readonly string _appQuoteServiceUrl;

        public RenewalService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<RenewalService> logger,
            IAppSettings appSettings,
            IUIContext uiContext,
            IMapper mapper)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _uiContext = uiContext;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appRenewalServiceUrl = appSettings.GetSetting("App.Renewal.Url");
            _appQuoteServiceUrl = appSettings.GetSetting("App.Quote.Url");
        }


        public async Task<List<DetailedModel>> GetRenewalsDetailedFor(SearchRenewalDetailed.Request request)
        {
            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);
            _logger.LogInformation($"GetRenewalsDetailedFor {req.ToString()}");
            var coreResult = await
                _middleTierHttpClient.GetAsync<ResponseDetailedDto>(req).ConfigureAwait(false);
            var modelList = _mapper.Map<List<DetailedModel>>(coreResult.Data);
            return modelList;
        }

        public async Task<List<SummaryModel>> GetRenewalsSummaryFor(SearchRenewalSummary.Request request)
        {
            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);
            _logger.LogInformation($"GetRenewalsSummaryFor {req.ToString()}");
            var coreResult = await
                _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
            var modelList = _mapper.Map<List<SummaryModel>>(coreResult.Data);
            return modelList;
        }
        public async Task<int> GetRenewalsSummaryCountFor(RefinementRequest request)
        {
            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);
            _logger.LogInformation($"GetRenewalsSummaryCountFor {req.ToString()}");
            var coreResult = await
                _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
            return coreResult.Count;
        }

        public async Task<List<QuoteDetailedModel>> GetRenewalsQuoteDetailedFor(GetRenewalQuoteDetailed.Request request)
        {
            var req = _appRenewalServiceUrl.BuildQuery(request);
            _logger.LogInformation($"GetRenewalsSummaryCountFor {req.ToString()}");
            var coreResult = await
               _middleTierHttpClient.GetAsync<IEnumerable<QuoteDetailedDto>>(req).ConfigureAwait(false);
            var modelList = _mapper.Map<List<QuoteDetailedModel>>(coreResult);
            return modelList;
        }

        public async Task<RefinementGroupsModel> GetRefainmentGroup(RefinementRequest request)
        {
            var count = await GetRenewalsSummaryCountFor(request);
            request.Details = false;
            var coreResult = await GetSummary(count, request);
            var rgroupModel = new RefinementGroupsModel()
            {
                Group = "RenewalAttributes",
                Refinements = new List<RefinementsModel>()

            };
            rgroupModel.Refinements.Add(GetVendor(coreResult));
            rgroupModel.Refinements.Add(GetEndUserType(coreResult));
            rgroupModel.Refinements.Add(GetRenewalType(coreResult));
            return rgroupModel;
        }

        private async Task<List<SummaryDto>> GetSummary(int TotalCount, RefinementRequest request)
        {
            var list = new List<SummaryDto>();
            int length = (TotalCount / request.PageSize) + 2;
            for (int i = 1; i < length; i++)
            {
                request.Page = i;
                var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);
                var coreResult = await
                   _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
                list.AddRange(coreResult.Data);
            }
            return list;
        }

        private RefinementsModel GetVendor(IEnumerable<SummaryDto> list)
        {
            var vendors = list.Select(x => x.Vendor.Name).Distinct();
            List<OptionsModel> options = new List<OptionsModel>();
            foreach (var vendor in vendors)
            {
                var subModel = list?.Where(x => x.Vendor.Name == vendor)?.Select(x => x.ProgramName)?.Distinct()?.Select(x => new OptionsBaseModel { Text = x }).ToList();

                var element = new OptionsModel() { Text = vendor, SubOptions = subModel };
                options.Add(element);
            }
            RefinementsModel result = new RefinementsModel { Name = "Vendors and Programs", Options = options };
            result.Options = options;
            return result;
        }

        private RefinementsModel GetEndUserType(IEnumerable<SummaryDto> list)
        {
            RefinementsModel result = new RefinementsModel { 
                Name = "End user type",
                Options = list?.Select(x => x.EndUserType)?
                .Distinct()?.Where(x => x != null)
                ?.Select(w => new OptionsModel() { Text = w }).ToList()
            };
            return result;
        }
        private RefinementsModel GetRenewalType(IEnumerable<SummaryDto> list)
        {
            RefinementsModel result = new RefinementsModel
            {
                Name = "Renewal Type",
                Options = list?.Select(x => x.Source.Type)
                ?.Distinct()?.Where(x => x != null)
                ?.Select(w => new OptionsModel() { Text = w }).ToList()
            };
            return result;
        }
    }
}
