//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public class RenewalService : IRenewalService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<RenewalService> _logger;
        private readonly IMapper _mapper;
        private readonly string _appRenewalServiceUrl;

        public RenewalService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<RenewalService> logger,
            IAppSettings appSettings,
            IMapper mapper)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appRenewalServiceUrl = appSettings.GetSetting("App.Renewal.Url");
        }

        public async Task<DetailedResponseModel> GetRenewalsDetailedFor(SearchRenewalDetailed.Request request)
        {
            if (!string.IsNullOrWhiteSpace(request.Instance))
            {
                request.Instance += "*";
            }
            else if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                request.SerialNumber += "*";
            }

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsDetailedFor {Req}", req);

            try
            {
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseDetailedDto>(req).ConfigureAwait(false);
                var modelList = _mapper.Map<List<DetailedModel>>(coreResult.Data);
                var count = coreResult.Count;

                return new DetailedResponseModel()
                {
                    Count = count,
                    Response = modelList
                };
            }
            catch (Exception ex)
            {
                _logger.LogError("Can't retrieve Renewal data, details: {Message}", ex.Message);

                return new DetailedResponseModel { Count = 0, Response = null };
            }
        }

        public async Task<SummaryResponseModel> GetRenewalsSummaryFor(SearchRenewalSummary.Request request)
        {
            if (!string.IsNullOrWhiteSpace(request.Instance))
            {
                request.Instance += "*";
            }
            else if (!string.IsNullOrWhiteSpace(request.SerialNumber))
            {
                request.SerialNumber += "*";
            }

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsSummaryFor {Req}", req);

            try
            {
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
                var modelList = _mapper.Map<List<SummaryModel>>(coreResult.Data);
                var count = coreResult.Count;

                return new SummaryResponseModel() { Count = count, Response = modelList };
            }
            catch (Exception ex)
            {
                _logger.LogError("Can't retrieve Renewal data, summary: {Message}", ex.Message);

                return new SummaryResponseModel { Count = 0, Response = null };
            }


        }

        public async Task<int> GetRenewalsSummaryCountFor(RefinementRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.ResellerId))
            {
                request.ResellerId += "*";
            }

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsSummaryCountFor {Req}", req);

            var coreResult = await _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
            
            return coreResult.Count;
        }

        public async Task<List<QuoteDetailedModel>> GetRenewalsQuoteDetailedFor(GetRenewalQuoteDetailed.Request request)
        {
            var req = _appRenewalServiceUrl.BuildQuery(request);

            _logger.LogInformation("GetRenewalsQuoteDetailedFor {Req}", req);

            var coreResult = await _middleTierHttpClient.GetAsync<IEnumerable<QuoteDetailedDto>>(req).ConfigureAwait(false);
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
            var length = (TotalCount / request.PageSize) + 2;

            for (var i = 1; i < length; i++)
            {
                request.Page = i;

                var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);

                list.AddRange(coreResult.Data);
            }

            return list;
        }

        private static RefinementsModel GetVendor(IEnumerable<SummaryDto> list)
        {
            var vendors = list.Select(x => x.Vendor.Name).Distinct();
            List<OptionsModel> options = new();

            foreach (var vendor in vendors)
            {
                var subModel = list?.Where(x => x.Vendor.Name == vendor)?.Select(x => x.ProgramName)?.Distinct()?.Select(x => new OptionsBaseModel { Text = x }).ToList();
                var element = new OptionsModel() { Text = vendor, SubOptions = subModel };

                options.Add(element);
            }

            RefinementsModel result = new() { Name = "Vendors and Programs", Options = options };
            result.Options = options;

            return result;
        }

        private static RefinementsModel GetEndUserType(IEnumerable<SummaryDto> list)
        {
            RefinementsModel result = new()
            { 
                Name = "End user type",
                Options = list?.Select(x => x.EndUserType)?.Distinct()?.Where(x => x != null)?.Select(w => new OptionsModel() { Text = w }).ToList()
            };

            return result;
        }

        private static RefinementsModel GetRenewalType(IEnumerable<SummaryDto> list)
        {
            RefinementsModel result = new()
            {
                Name = "Renewal Type",
                Options = list?.Select(x => x.Source.Type)?.Distinct()?.Where(x => x != null)?.Select(w => new OptionsModel() { Text = w }).ToList()
            };

            return result;
        }
    }
}
