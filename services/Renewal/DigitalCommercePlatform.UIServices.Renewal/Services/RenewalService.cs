//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewal;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.RefinementsDto;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public class RenewalService : IRenewalService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<RenewalService> _logger;
        private readonly IMapper _mapper;
        private readonly string _appRenewalServiceUrl;
        private readonly IHelperService _helperQueryService;

        public RenewalService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<RenewalService> logger,
            IAppSettings appSettings,
            IMapper mapper,
            IHelperService helperQueryService)
        {
            _middleTierHttpClient = middleTierHttpClient;
            _logger = logger;
            _mapper = mapper;
            _appRenewalServiceUrl = appSettings.GetSetting("App.Renewal.Url");
            _helperQueryService = helperQueryService;
        }

        public async Task<DetailedResponseModel> GetRenewalsDetailedFor(SearchRenewalDetailed.Request request)
        {
            AppendPartialSearch(request);
            SortByRequestDetails(request);

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsDetailedFor {Req}", req);

            try
            {
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseDetailedDto>(req).ConfigureAwait(false);
                var modelList = _mapper.Map<List<DetailedModel>>(coreResult.Data);

                modelList.ForEach(model =>
                {
                    model.VendorLogo = _helperQueryService.GetVendorLogo(model.Vendor?.Name);
                });

                return new DetailedResponseModel
                {
                    Count = coreResult.Count,
                    Response = modelList
                };
            }
            catch (Exception ex)
            {
                _logger.LogError("Can't retrieve Renewal data, details: {Message}", ex.Message);

                return new DetailedResponseModel { Count = 0, Response = null };
            }
        }

        private void SortByRequestDetails(SearchRenewalDetailed.Request request)
        {
            string sortValue = request?.SortBy?.FirstOrDefault()?.ToLower();
            string sortDirection = request?.SortAscending == true ? "asc" : "desc";
            sortValue = sortValue + ":" + sortDirection;
            string sortDate = "dueDate:desc";
            List<string> listSortby = new List<string> { sortDate, sortValue };
            request.SortBy = listSortby;
        }

        public async Task<SummaryResponseModel> GetRenewalsSummaryFor(SearchRenewalSummary.Request request)
        {
            AppendPartialSearch(request);
            SortByRequestSummary(request);

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsSummaryFor {Req}", req);

            try
            {
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
                var modelList = _mapper.Map<List<SummaryModel>>(coreResult.Data);

                modelList.ForEach(model =>
                {
                    model.VendorLogo = _helperQueryService.GetVendorLogo(model.Vendor?.Name);
                });

                return new SummaryResponseModel
                {
                    Count = coreResult.Count,
                    Response = modelList
                };
            }
            catch (Exception ex)
            {
                _logger.LogError("Can't retrieve Renewal data, summary: {Message}", ex.Message);

                return new SummaryResponseModel { Count = 0, Response = null };
            }
        }

        private void SortByRequestSummary(SearchRenewalSummary.Request request)
        {
            string sortValue = request?.SortBy?.FirstOrDefault()?.ToLower();
            string sortDirection = request?.SortAscending == true ? "asc" : "desc";
            sortValue = sortValue + ":" + sortDirection;
            string sortDate = "dueDate:desc";
            List<string> listSortby = new List<string> { sortDate, sortValue };
            request.SortBy = listSortby;
        }

        public async Task<List<QuoteDetailedModel>> GetRenewalsQuoteDetailedFor(GetRenewalQuoteDetailed.Request request)
        {
            var req = _appRenewalServiceUrl.BuildQuery(request);

            _logger.LogInformation("GetRenewalsQuoteDetailedFor {Req}", req);

            var coreResult = await _middleTierHttpClient.GetAsync<IEnumerable<QuoteDetailedDto>>(req).ConfigureAwait(false);
            var modelList = _mapper.Map<List<QuoteDetailedModel>>(coreResult);

            modelList.ForEach(quote =>
            {
                if (quote != null)
                {
                    _helperQueryService.PopulateLinesFor(quote.Items, string.Empty);
                    var vendorName = quote.Items
                        .SelectMany(i =>
                            i.Product
                            .Where(p =>
                                !string.IsNullOrWhiteSpace(p.Manufacturer)
                            )
                        )
                        .FirstOrDefault()
                        .Manufacturer;
                    quote.VendorLogo = _helperQueryService.GetVendorLogo(vendorName);
                }
            });

            return modelList;
        }

        public async Task<RefinementGroupsModel> GetRefainmentGroup(RefinementRequest request)
        {
            var req = _appRenewalServiceUrl.AppendPathSegment("GetRefinementGroups")
                .BuildQuery(request);

            var refinementGroupsResult = await _middleTierHttpClient.GetAsync<RefinementGroupData>(req).ConfigureAwait(false);

            return _mapper.Map<RefinementGroupsModel>(refinementGroupsResult);
        }

        private static void AppendPartialSearch<T>(T request) where T : PartialSearchProps
        {
            var hasValue = CheckPartialSearchForResellerId(request.ResellerId);

            if (!hasValue)
            {
                request.ResellerName = CheckPartialSearch(request.ResellerName);
                request.ResellerPO = CheckPartialSearch(request.ResellerPO);
                request.EndUser = CheckPartialSearch(request.EndUser);
                request.EndUserEmail = CheckPartialSearch(request.EndUserEmail);
                request.ContractID = CheckPartialSearch(request.ContractID);
                request.Instance = CheckPartialSearch(request.Instance);
                request.SerialNumber = CheckPartialSearch(request.SerialNumber);
            }
        }

        private static bool CheckPartialSearchForResellerId(List<string> resellers)
        {
            if (resellers?.Count > 0)
            {
                for (var i = 0; i < resellers.Count; i++)
                {
                    if (!resellers[i].EndsWith("*"))
                    {
                        var sb = new StringBuilder(resellers[i]);
                        sb.Append('*');

                        resellers[i] = sb.ToString();
                    }
                }

                return true;
            }

            return false;
        }

        private static string CheckPartialSearch(string str)
        {
            if (!string.IsNullOrWhiteSpace(str) && !str.EndsWith('*'))
                str += '*';

            return str;
        }
    }
}
