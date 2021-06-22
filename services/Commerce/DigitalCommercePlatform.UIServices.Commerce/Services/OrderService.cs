using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class OrderService : IOrderService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<OrderService> _logger;
        private readonly IUIContext _uiContext;
        private readonly IAppSettings _appSettings;
        private readonly IMapper _mapper;

        public OrderService(IMiddleTierHttpClient middleTierHttpClient,
            IHttpClientFactory httpClientFactory,
            ILogger<OrderService> logger,
            IAppSettings appSettings,
            IUIContext uiContext,
            IMapper mapper)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _uiContext = uiContext;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appSettings = appSettings;
        }

        public async Task<byte[]> GetPdfInvoiceAsync(string invoiceId)
        {
            if (string.IsNullOrEmpty(invoiceId)) { return null; }
            var coreOrderServiceUrl = _appSettings.GetSetting("Core.Order.Url");
            var url = coreOrderServiceUrl.AppendPathSegment("Invoice/GetPdfInvoice").SetQueryParams(new { id = invoiceId });

            HttpClient httpClient = _httpClientFactory.CreateClient();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _uiContext.AccessToken);
            httpClient.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate, br");
            httpClient.DefaultRequestHeaders.Add("Accept-Language", _uiContext.Language);
            httpClient.DefaultRequestHeaders.Add("Site", _uiContext.Site);
            httpClient.DefaultRequestHeaders.Add("Consumer", _uiContext.Consumer);
            var httpRequest = new HttpRequestMessage()
            {
                RequestUri = new Uri(url),
                Method = HttpMethod.Get,
            };
            HttpResponseMessage response = await httpClient.SendAsync(httpRequest);
            if (response.IsSuccessStatusCode)
            {
                byte[] binaryContentPdf = await response.Content.ReadAsByteArrayAsync();
                return binaryContentPdf;
            }
            else if (response.StatusCode == HttpStatusCode.NotFound)
            {
                return null;
            }
            response.EnsureSuccessStatusCode();
            return null;
        }

        public async Task<List<InvoiceModel>> GetInvoicesFromOrderIdAsync(string orderId)
        {
            var _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = _appOrderServiceUrl.AppendPathSegment("invoice/find").SetQueryParams(new { orderId });
            var listInvoices = await _middleTierHttpClient.GetAsync<InvoiceFindResponse>(url);
            return listInvoices?.Data?.ToList();
        }
    }
}
