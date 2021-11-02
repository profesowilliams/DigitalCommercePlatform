//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalFoundation.Common.Extensions;

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
            var coreResult = await
                _middleTierHttpClient.GetAsync<IEnumerable<DetailedDto>>(_appRenewalServiceUrl.BuildQuery(request)).ConfigureAwait(false);
            var modelList = _mapper.Map<List<DetailedModel>>(coreResult);
            return modelList;
        }

        public async Task<List<SummaryModel>> GetRenewalsSummaryFor(SearchRenewalSummary.Request request)
        {

            var  coreResult = await
                _middleTierHttpClient.GetAsync<IEnumerable<SummaryDto>>(_appRenewalServiceUrl.BuildQuery(request)).ConfigureAwait(false);
            var modelList = _mapper.Map<List<SummaryModel>>(coreResult);
            return modelList;
        }

        public async Task<List<RenewalsModel>> GetRenewalsFor(GetRenewal.Request request)
        {
            // write Mapper
            //return dummy data 
            var lstRenewals = new List<RenewalsModel>();

            for (int i = 0; i < 5; i++)
            {
                var objRenewalsModel = new RenewalsModel
                {
                    Id = i
                };
                lstRenewals.Add(objRenewalsModel);
            }

            return await Task.FromResult(lstRenewals);
        }
    }
}
