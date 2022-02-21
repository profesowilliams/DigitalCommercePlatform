//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Return;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Features.Client.Exceptions;
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
        private readonly IHelperService _helperService;
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
            IMapper mapper,
            IHelperService helperService
            )
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _uiContext = uiContext;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appSettings = appSettings;
            _helperService = helperService;
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

        public async Task<OrderModel> GetOrderByIdAsync(string id)
        {
            string _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdResponse = await _middleTierHttpClient.GetAsync<List<OrderModel>>(url);

            OrderModel result = _helperService.FilterOrderLines(getOrderByIdResponse?.FirstOrDefault());
            result = PopulateOrderDetails(result);

            return result;
        }

        /// <summary>
        /// Move to order Service
        /// </summary>
        /// <param name="orderParameters"></param>
        /// <returns></returns>
        public async Task<OrdersContainer> GetOrdersAsync(SearchCriteria orderParameters)
        {
            OrdersContainer findOrdersDto = await FindOrder(orderParameters);

            foreach (var item in findOrdersDto.Data)
            {

                item.OrderMethod = await _helperService.GetOrderType(string.IsNullOrWhiteSpace(item.PoType) ? "#" : item.PoType.ToUpper(), string.IsNullOrWhiteSpace(item.DocType) ? "#" : item.DocType.ToUpper());

                var invoiceDetails = item.Items?.SelectMany(i => i.Invoices)
               .Select(i => new InvoiceModel { ID = i.ID }).ToList();

                if (invoiceDetails != null)
                {
                    await FindInvoices(item, invoiceDetails);
                }

            }
            return findOrdersDto;
        }

        private async Task FindInvoices(OrderModel item, List<InvoiceModel> invoiceDetails)
        {
            if (invoiceDetails.Any())
            {
                var invoices = invoiceDetails.Select(i => i.ID).Distinct().ToList();
                await OrderReturnsInformationForInvoice(item, invoices);
            }
        }
        /// <summary>
        /// Set return parameter true false
        /// </summary>
        /// <param name="item"></param>
        /// <param name="invoices"></param>
        /// <returns></returns>

        private async Task OrderReturnsInformationForInvoice(OrderModel item, List<string> invoices)
        {
            if (invoices.Any())
            {
                foreach (var invoice in invoices)
                {
                    var _appreturn = _appSettings.GetSetting("App.Return.Url");
                    _appreturn = _appreturn.AppendPathSegment("/Find").SetQueryParam("details=false&InvoiceNumbers", invoice);

                    try
                    {
                        var findReturnsDTO = await _middleTierHttpClient.GetAsync<FindResponse<IEnumerable<ReturnModel>>>(_appreturn);
                        if (findReturnsDTO != null && findReturnsDTO.Data.Any())
                        {
                            item.Return = true;
                            break;
                        }
                    }
                    catch (RemoteServerHttpException ex)
                    {
                        if (ex.Code == HttpStatusCode.NotFound)
                            _logger.LogInformation("Calling App-Retrun to get return formation: returned Involice not found ! ");
                        else if (ex.Code == HttpStatusCode.InternalServerError)
                            _logger.LogInformation("Calling App-Retrun to get return formation: returned Internal server error ! ");
                        else
                            _logger.LogInformation("Calling App-Retrun to get return formation: returned error ! " + ex.Message.ToString());

                        item.Return = false;
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogInformation("Calling App-Retrun to get return formation: returned error ! " + ex.Message.ToString());
                        item.Return = false;
                        break;
                    }

                }
            }
        }

        /// <summary>
        /// Move to order service
        /// </summary>
        /// <param name="orderParameters"></param>
        /// <returns></returns>
        private async Task<OrdersContainer> FindOrder(SearchCriteria orderParameters)
        {
            var origin = string.IsNullOrWhiteSpace(orderParameters.Origin) ? null : orderParameters.Origin.ToLower();

            orderParameters.Origin = origin switch
            {
                "web" => "Web",
                "b2b" => "B2B",
                "pe" => "Manual",
                _ => null,
            };

            if (!string.IsNullOrWhiteSpace(orderParameters.Id))
            {
                orderParameters.Id += "*";
            }
            else if (!string.IsNullOrWhiteSpace(orderParameters.CustomerPO))
            {
                orderParameters.CustomerPO += "*";
            }
            orderParameters.CreatedFrom = _helperService.GetDateParameter((DateTime)orderParameters.CreatedFrom, "from");
            orderParameters.CreatedTo = _helperService.GetDateParameter((DateTime)orderParameters.CreatedTo, "to");

            string _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = string.Empty;
            if (orderParameters.IdType == 0)
            {
                url = _appOrderServiceUrl.AppendPathSegment("Find")
                        .SetQueryParams(new
                        {
                            orderParameters.Id,
                            orderParameters.CustomerPO,
                            orderParameters.Manufacturer,
                            orderParameters.CreatedFrom,
                            orderParameters.CreatedTo,
                            orderParameters.Status,
                            Sort = orderParameters.SortBy,
                            SortAscending = orderParameters.SortAscending.ToString(),
                            orderParameters.PageSize,
                            Page = orderParameters.PageNumber,
                            WithPaginationInfo = orderParameters.WithPaginationInfo,
                            Details = true,
                            orderParameters.Origin,
                            orderParameters.ConfirmationNumber,
                            orderParameters.InvoiceId
                        });
            }
            else
            {
                url = _appOrderServiceUrl.AppendPathSegment("Find")
                    .SetQueryParams(new
                    {
                        orderParameters.Id,
                        Sort = orderParameters.SortBy,
                        SortAscending = orderParameters.SortAscending.ToString(),
                        Details = true,
                        orderParameters.IdType,
                        orderParameters.PageSize,
                        Page = orderParameters.PageNumber,
                        WithPaginationInfo = orderParameters.WithPaginationInfo,

                    });
            }

            var findOrdersDto = await _middleTierHttpClient.GetAsync<OrdersContainer>(url);
            return findOrdersDto;
        }

        private Models.Order.Internal.OrderModel PopulateOrderDetails(OrderModel order)
        {
            if (order != null)
            {
                order.Tax = CalculateTax(order);
                order.Freight = CalculateFreight(order);
                order.OtherFees = CalculateOtherFees(order);
                order.SubTotal = order.Price ?? 0;
                decimal? subtotal = order.SubTotal ?? 0;

                order.Total = subtotal + order.OtherFees + order.Freight + order.Tax;
            }
            return order;
        }

        private decimal? CalculateFreight(OrderModel order)
        {
            decimal? freight = order.Items.Where(t => t.Freight.HasValue).Sum(t => t.Freight.Value);
            return freight ?? 0;
        }

        private decimal? CalculateOtherFees(OrderModel order)
        {
            decimal? otherFees = order.Items.Where(t => t.OtherFees.HasValue).Sum(t => t.OtherFees.Value);
            return otherFees ?? 0;
        }
        private decimal? CalculateTax(OrderModel order)
        {
            decimal? tax = order.Items.Where(t => t.Tax.HasValue).Sum(t => t.Tax.Value);
            return tax ?? 0;
        }
    }
}
