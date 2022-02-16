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
using DigitalFoundation.Common.Providers.Settings;
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
        private readonly IMapper _mapper;
        private readonly string _appRenewalServiceUrl;
        private readonly IHelperService _helperQueryService;

        public RenewalService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<RenewalService> logger,
            IAppSettings appSettings,
            IMapper mapper,
            IHelperService helperQueryService)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appRenewalServiceUrl = appSettings.GetSetting("App.Renewal.Url");
            _helperQueryService = helperQueryService ?? throw new ArgumentNullException(nameof(helperQueryService));
        }

        public async Task<DetailedResponseModel> GetRenewalsDetailedFor(SearchRenewalDetailed.Request request)
        {
            var found = AddPartialSearchReseller(request);

            if (!found)
            {
                found = AddPartialSearchEndUser(request);
            }
            
            if (!found)
            {
                _ = AddPartialSearchOthers(request);
            } 

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsDetailedFor {Req}", req);

            try
            {
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseDetailedDto>(req).ConfigureAwait(false);
                var modelList = _mapper.Map<List<DetailedModel>>(coreResult.Data);
                var count = coreResult.Count;

                switch (request.SortBy?.ToLowerInvariant())
                {
                    case "duedays":
                        if (request.SortAscending)
                        {
                            modelList = modelList.OrderBy(x => x.DueDays).ToList();
                        }
                        else
                        {
                            modelList = modelList.OrderByDescending(x => x.DueDays).ToList();
                        }
                        break;
                }

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
            var found = AddPartialSearchReseller(request);

            if (!found)
            {
                found = AddPartialSearchEndUser(request);
            }
            
            if (!found)
            {
                _ = AddPartialSearchOthers(request);
            }            

            var req = _appRenewalServiceUrl.AppendPathSegment("Find").BuildQuery(request);

            _logger.LogInformation("GetRenewalsSummaryFor {Req}", req);

            try
            {
                var coreResult = await _middleTierHttpClient.GetAsync<ResponseSummaryDto>(req).ConfigureAwait(false);
                var modelList = _mapper.Map<List<SummaryModel>>(coreResult.Data);
                var count = coreResult.Count;

                switch (request.SortBy?.ToLowerInvariant())
                {
                    case "duedays":
                        if (request.SortAscending)
                        {
                            modelList = modelList.OrderBy(x => x.DueDays).ToList();
                        }
                        else
                        {
                            modelList = modelList.OrderByDescending(x => x.DueDays).ToList();
                        }
                        break;
                }

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
            if (!string.IsNullOrWhiteSpace(request.ResellerId) && !request.ResellerId.EndsWith("*"))
            {
                request.ResellerId += "*";
            }
            else if (!string.IsNullOrWhiteSpace(request.ResellerName) && !request.ResellerName.EndsWith("*"))
            {
                request.ResellerName += "*";
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

            modelList.ForEach(quote =>
            {
                if (quote != null)
                {
                    _helperQueryService.PopulateLinesFor(quote.Items, string.Empty);
                }
            });

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

        private static void AddPartialSearchResellerId(List<string> resellerIds)
        {
            for (var i = 0; i < resellerIds.Count; i++)
            {
                if (!resellerIds[i].EndsWith("*"))
                {
                    resellerIds[i] += "*";
                }
            }
        }

        private static bool AddPartialSearchReseller(SearchRenewalDetailed.Request request)
        {
            if (request.ResellerId != null && request.ResellerId.Count > 0)
            {
                AddPartialSearchResellerId(request.ResellerId);

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.ResellerName) && !request.ResellerName.EndsWith("*"))
            {
                request.ResellerName += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.ResellerPO) && !request.ResellerPO.EndsWith("*"))
            {
                request.ResellerPO += "*";

                return true;
            }

            return false;
        }

        private static bool AddPartialSearchEndUser(SearchRenewalDetailed.Request request)
        {
            if (!string.IsNullOrWhiteSpace(request.EndUser) && !request.EndUser.EndsWith("*"))
            {
                request.EndUser += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.EndUserEmail) && !request.EndUserEmail.EndsWith("*"))
            {
                request.EndUserEmail += "*";

                return true;
            }

            return false;
        }

        private static bool AddPartialSearchOthers(SearchRenewalDetailed.Request request)
        {
            if (!string.IsNullOrWhiteSpace(request.ContractID) && !request.ContractID.EndsWith("*"))
            {
                request.ContractID += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.Instance) && !request.Instance.EndsWith("*"))
            {
                request.Instance += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.SerialNumber) && !request.SerialNumber.EndsWith("*"))
            {
                request.SerialNumber += "*";

                return true;
            }

            return false;
        }

        private static bool AddPartialSearchReseller(SearchRenewalSummary.Request request)
        {
            if (request.ResellerId != null && request.ResellerId.Count > 0)
            {
                AddPartialSearchResellerId(request.ResellerId);

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.ResellerName) && !request.ResellerName.EndsWith("*"))
            {
                request.ResellerName += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.ResellerPO) && !request.ResellerPO.EndsWith("*"))
            {
                request.ResellerPO += "*";

                return true;
            }

            return false;
        }

        private static bool AddPartialSearchEndUser(SearchRenewalSummary.Request request)
        {
            if (!string.IsNullOrWhiteSpace(request.EndUser) && !request.EndUser.EndsWith("*"))
            {
                request.EndUser += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.EndUserEmail) && !request.EndUserEmail.EndsWith("*"))
            {
                request.EndUserEmail += "*";

                return true;
            }

            return false;
        }

        private static bool AddPartialSearchOthers(SearchRenewalSummary.Request request)
        {
            if (!string.IsNullOrWhiteSpace(request.ContractID) && !request.ContractID.EndsWith("*"))
            {
                request.ContractID += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.Instance) && !request.Instance.EndsWith("*"))
            {
                request.Instance += "*";

                return true;
            }
            else if (!string.IsNullOrWhiteSpace(request.SerialNumber) && !request.SerialNumber.EndsWith("*"))
            {
                request.SerialNumber += "*";

                return true;
            }

            return false;
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
               var subModel = list?.Where(x => x.Vendor.Name == vendor)?.Select(x => x.ProgramName)?.Distinct()?.Select(x => new OptionsBaseModel { Text = x, SearchKey = "ProgramName" }).ToList();
               var element = new OptionsModel() { Text = vendor, SubOptions = subModel, SearchKey = "VendorName" };

               
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
                SearchKey = "EndUserType",
                Options = list?.Select(x => x.EndUserType)?.Distinct()?.Where(x => x != null)?.Select(w => new OptionsModel() { Text = w }).ToList()
            };

            return result;
        }

        private static RefinementsModel GetRenewalType(IEnumerable<SummaryDto> list)
        {
            RefinementsModel result = new()
            {
                Name = "Renewal Type",
                SearchKey = "Type",
                Options = list?.Select(x => x.Source.Type)?.Distinct()?.Where(x => x != null)?.Select(w => new OptionsModel() { Text = w }).ToList()
            };

            return result;
        }
    }
}
