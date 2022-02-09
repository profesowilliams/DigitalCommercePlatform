//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class HelperService : IHelperService
    {
        private readonly ILogger<HelperService> _logger;
        private readonly IUIContext _context;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly IAppSettings _appSettings;
        private readonly IHttpClientFactory _httpClientFactory;
        public HelperService(ILogger<HelperService> logger,
                             IUIContext context,
                             IMiddleTierHttpClient middleTierHttpClient,
                             IAppSettings appSettings,
                             IHttpClientFactory httpClientFactory)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _context = context;
            _middleTierHttpClient = middleTierHttpClient;
            _appSettings = appSettings;
            _httpClientFactory = httpClientFactory;
        }

        public string GetParameterName(string parameter)
        {
            var sortBy = string.Empty;
            if (string.IsNullOrEmpty(parameter))
            {
                return sortBy;
            }
            if (parameter.ToLower() == "id")
            {
                sortBy = "Source.OriginId";
            }
            else if (parameter.ToLower() == "created")
            {
                sortBy = "Created";
            }
            else if (parameter.ToLower() == "quotevalue" || parameter.ToLower() == "formatedquotevalue")
            {
                sortBy = "Price";
            }
            else if (parameter.ToLower() == "updated")
            {
                sortBy = "Updated";
            }
            else if (parameter.ToLower() == "endusername")
            {
                sortBy = "EndUserName";
            }
            else
            {
                sortBy = "Created";
            }
            return sortBy;
        }


        public bool GetOrderPricingConditions(string pricingConditionId, out TypeModel orderType, out LevelModel orderLevel)
        {
            try
            {
                var response = GetOrderPricingConditionMappings(pricingConditionId);
                orderType = new TypeModel
                {
                    Id = response.TypeId,
                    Value = response.Type,
                };

                orderLevel = new LevelModel
                {
                    Id = response.LevelId,
                    Value = response.Level,
                };

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting Order Level & Type {nameof(HelperService.GetOrderPricingConditions)}");

                orderType = new TypeModel
                {
                    Id = "",
                    Value = "",
                };

                orderLevel = new LevelModel
                {
                    Id = "",
                    Value = "0",
                };
            }


            return true;
        }

        private OrderPricingCondtionMapping GetOrderPricingConditionMappings(string pricingConditionId)
        {
            pricingConditionId = pricingConditionId ?? "Commercial";
            List<OrderPricingCondtionMapping> pricingDetails = new List<OrderPricingCondtionMapping>
                {
                    new OrderPricingCondtionMapping {Id ="Commercial",  TypeId ="000", Type="Commercial", Level="", LevelId="", SalesOrganization = "0100", Site="US", Description="Commercial"},
                    new OrderPricingCondtionMapping { Id ="EduStudentStaff",  TypeId ="001", Type="", LevelId="EF", Level="", SalesOrganization = "0100", Site="US", Description="Education (Student & Staff)" },
                    new OrderPricingCondtionMapping { Id ="EduHigher",  TypeId ="001", Type="Government", LevelId="EH", Level="Education (Higher)", SalesOrganization = "0100", Site="US", Description="Education (Higher)" },
                    new OrderPricingCondtionMapping { Id ="EduK12",  TypeId ="001", Type="Government", LevelId="EL", Level="Education (K-12)", SalesOrganization = "0100", Site="US", Description="Education (K-12)" },
                    new OrderPricingCondtionMapping { Id ="EduErate",  TypeId ="001", Type="", LevelId="ER", Level="", SalesOrganization = "0100", Site="US", Description="Education (Erate)" },
                    new OrderPricingCondtionMapping { Id ="GovtFederal",  TypeId ="001", Type="Government", LevelId="FE", Level="Federal", SalesOrganization = "0100", Site="US", Description="Federal" },
                    new OrderPricingCondtionMapping { Id ="GovtFederalGSA",  TypeId ="001", Type="", LevelId="FG", Level="", SalesOrganization = "0100", Site="US", Description="Federal GSA" },
                    new OrderPricingCondtionMapping { Id ="GovtLocal",  TypeId ="001", Type="Government", LevelId="LO", Level="Local", SalesOrganization = "0100", Site="US", Description="Local" },
                    new OrderPricingCondtionMapping { Id ="GovtState",  TypeId ="001", Type="Government", LevelId="ST", Level="State", SalesOrganization = "0100", Site="US", Description="State" },
                    new OrderPricingCondtionMapping { Id ="Medical",  TypeId ="001", Type="Government", LevelId="MD", Level="Medical", SalesOrganization = "0100", Site="US", Description="Medical" },
                    new OrderPricingCondtionMapping { Id ="SEWPContract", Type ="001", TypeId="Government", Level="S5", LevelId="SEWP Contract", SalesOrganization = "0100", Site="US", Description="SEWP Contract" },
                };

            //var response = pricingDetails.Where(p => p.Id == pricingConditionId).Any() ? pricingDetails.Where(p => p.Id == pricingConditionId && p.SalesOrganization == _context.User.ActiveCustomer.SalesOrganization).FirstOrDefault() : pricingDetails.Where(p => p.Id == "0").FirstOrDefault();
            var response = pricingDetails.Where(p => p.Id == pricingConditionId).Any() ? pricingDetails.Where(p => p.Id == pricingConditionId && p.SalesOrganization == "0100").FirstOrDefault() : pricingDetails.Where(p => p.Id == "0").FirstOrDefault();
            if (response == null)
            {
                response = new OrderPricingCondtionMapping();
                response.Type = "Government";
                response.TypeId = "001";
                response.Level = "Education (Higher)";
                response.LevelId = "EH";
                response.SalesOrganization = "0100";
                response.Site = "US";
                response.Description = "Education (Higher)";
            }
            return response;
        }

        /// <summary>
        /// TO DO : return out put string with details PHASE 2
        /// </summary>
        /// <param name="poType"></param>
        /// <param name="docType"></param>
        /// <returns></returns>
        public Task<string> GetOrderType(string poType, string docType)
        {
            string orderType = poType + ":" + docType;
            if (string.IsNullOrWhiteSpace(orderType)) return Task.FromResult("Manual");

            string response = "Manual";

            switch (orderType.ToUpper())
            {
                case var ot when new[] { "#:ZZOR", "ZZED:ZZED", "ZZEK:ZZED", "ZZED:ZZKE", "ZZOR", "ZZED", "ZZKE", "ZZEK" }.Contains(ot):
                    response = "B2B";
                    break;
                case var ot when new[] { "#:ZZSB", "ZQ2O:ZZOR", "#:ZZDR", "ZZUP:ZZSB", "ZQ2O:ZZSB", "YIPO:ZZDR", "ZZSB", "ZQ2O", "ZZOR", "ZZDR", "ZZUP", "YIPO" }.Contains(ot):
                    response = "Manual";
                    break;
                case var ot when new[] { "ZZWE:ZZIT", "ZZIT:ZZIT", "ZZLS:ZZIT", "DFUE:ZZST", "ZZYP:ZZIT", "ZZ1S:ZZIT", "ZZTB:ZZIT", "ZZST", "ZZWE", "ZZIT", "ZZLS", "DFUE", "ZZYP", "ZZ1S", "ZZTB" }.Contains(ot):
                    response = "Web";
                    break;
                case var ot when new[] { "ZZXL:ZZED", "ZZAP:ZZIT" }.Contains(ot):
                    response = "API";
                    break;
                case "default":
                    response = "Manual";
                    break;
            }
            return Task.FromResult(response);
        }


        /// <summary>
        ///  Populate lines for order and Quotes
        /// </summary>
        /// <param name="items"></param>
        /// <param name="vendorName"></param>
        /// <returns></returns>
        public async Task<List<Line>> PopulateLinesFor(List<Line> items, string vendorName, string source)
        {
            ProductData productDetails;
            string productUrl = BuildQueryForProductApiCall(items, vendorName);

            try
            {
                if (source.Equals("2"))
                {
                    await GetUnitListPriceFromAPIAsync(items);
                }
                productDetails = await _middleTierHttpClient.GetAsync<ProductData>(productUrl);
                ProductsModel product;

                foreach (var line in items)
                {
                    product = productDetails?.Data?.Where(p => p.ManufacturerPartNumber == line.MFRNumber).FirstOrDefault();
                    if (product != null && line != null)
                    {
                        MapLines(product, line, source);
                    }
                    else
                    {
                        line.DisplayName = string.IsNullOrWhiteSpace(line?.Description) ? string.Empty : line?.Description;
                        line.ShortDescription = line.DisplayName;
                        line.Authorization = new AuthorizationModel
                        {
                            CanOrder = false,
                            CanViewPrice = false,
                            CustomerCanView = false,
                        };
                    }

                    // populate discount only for Quote Details Page

                    MapDiscount(source, line);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting product details : " + nameof(CommerceService));
            }

            return items;
        }

        private void MapDiscount(string source, Line line)
        {
            if (source.Equals("2") || source.Equals("Q"))
            {
                Discount[] discount = new Discount[1];

                discount = GetLineDiscount(line, discount);
                line.Discounts = discount;
            }
        }

        private async Task GetUnitListPriceFromAPIAsync(List<Line> items)
        {
            try
            {
                ShopProductRequest request = BuildShopProductAPIRequest(items);
                const string keyForGettingUrlFromSettings = "External.ShopProducts.Url";

                var requestUrl = _appSettings.TryGetSetting(keyForGettingUrlFromSettings)
                ?? throw new InvalidOperationException($"{keyForGettingUrlFromSettings} is missing from AppSettings");

                _logger.LogInformation($"Requested url is: {requestUrl}");

                //requestUrl = "https://svcinternal.prod.svc.us.tdworldwide.com/ProductService/api/ShopProducts/getProducts"; // for testing locally


                var httpClient = _httpClientFactory.CreateClient("ProductAPIClient");
                var requestJson = new StringContent(System.Text.Json.JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");
                var httpResponse = await httpClient.PostAsync(requestUrl, requestJson);

                httpResponse.EnsureSuccessStatusCode();

                var result = await System.Text.Json.JsonSerializer.DeserializeAsync<Response>(httpResponse.Content.ReadAsStream());
                if (result != null)
                {
                    foreach (var item in items)
                    {
                        var price = result.Products.Where(p => p.Article.ManufacturerPartNumber.Equals(item.VendorPartNo)).FirstOrDefault()?.Article.MSRP;
                        if (price == null)
                        {
                            price = result.Products.Where(p => p.Article.TechDataPartNumber.Equals(item.TDNumber)).FirstOrDefault()?.Article.MSRP;
                        }
                        item.MSRP = price;
                        item.UnitListPrice = (decimal)price;
                        item.UnitListPriceFormatted = string.Format("{0:N2}", item.UnitListPrice);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting product Unit price from Shop API : " + nameof(CommerceService));
            }
        }

        private Discount[] GetLineDiscount(Line item, Discount[] discount)
        {
            Discount lineDiscount = new Discount
            {
                Type = "Quote",
                Value = 0.0M,
                FormattedValue = string.Format("{0:N2}", 0.00)
            };
            discount = new Discount[1] { lineDiscount };
            try
            {
                if (item.UnitListPrice > 0 && item.UnitPrice > 0 && (item.UnitListPrice > item.UnitPrice))
                {
                    decimal? dicountPercent = ((item.UnitListPrice - item.UnitPrice) * 100) / item.UnitListPrice;
                    if (dicountPercent >= 0.1M)
                    {
                        Discount quoteDiscount = new Discount
                        {
                            Type = "Quote",
                            Value = (decimal)dicountPercent,
                            FormattedValue = string.Format("{0:N2}", dicountPercent)
                        };
                        discount = new Discount[1] { quoteDiscount };
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error While calculating discount " + ex.Message);
            }
            return discount;
        }

        private ShopProductRequest BuildShopProductAPIRequest(List<Line> items)
        {
            List<GetProductRequest> lstProducts = new List<GetProductRequest>();
            foreach (var line in items)
            {
                var product = new GetProductRequest
                {
                    ManufacturerPartNumber = string.Equals(line.MFRNumber, line.TDNumber) ? String.Empty : line.MFRNumber,
                    MaterialNumber = line.TDNumber
                };
                lstProducts.Add(product);
            }
            ShopProductRequest request = new ShopProductRequest { Products = lstProducts };
            return request;
        }

        /// <summary>
        /// Return Buy Type of customre 
        /// Possible values 
        /// Both 
        ///TDShop46
        ///TDAvnet67
        /// </summary>
        /// <returns></returns>
        public async Task<AccountDetails> GetCustomerAccountDetails()
        {
            bool? response = false;
            try
            {
                var customerId = _context.User.ActiveCustomer.CustomerNumber;
                string _customerServiceURL = _appSettings.GetSetting("App.Customer.Url");
                var customerURL = _customerServiceURL.BuildQuery("Id=" + customerId);
                var appResponse = await _middleTierHttpClient.GetAsync<IEnumerable<AccountDetails>>(customerURL);
                response = appResponse is null ? false : appResponse.FirstOrDefault().IsExclusive;

            }
            catch (Exception ex)
            {
                _logger.LogInformation("Error while consuming App-Customer Service " + ex.Message);
                response = false;
            }
            return new AccountDetails { IsExclusive = response };
        }

        /// <summary>
        /// returns Application product API call URL
        /// </summary>
        /// <param name="items"></param>
        /// <param name="vendorName"></param>
        /// <returns></returns>
        private string BuildQueryForProductApiCall(List<Line> items, string vendorName)
        {
            string _appProductServiceURL = string.Empty;
            try
            {
                _appProductServiceURL = _appSettings.GetSetting("App.Product.Url");
            }
            catch (Exception)
            {
                _appProductServiceURL = _appSettings.GetSetting("Product.App.Url");
            }

            string manufacturer = "";
            string system = vendorName;//configurationFindResponse?.Data?.FirstOrDefault()?.Vendor.Name;            
            string productId;

            // use string builder as flur is encoding "=" in Manufacturer Part Number resulting in wrong response
            StringBuilder sbManufacturer = new();
            StringBuilder sbVendorPart = new();


            int i = 0;
            foreach (var item in items)
            {
                if (!string.IsNullOrWhiteSpace(item?.MFRNumber))
                {
                    productId = item.MFRNumber;
                }
                else if (!string.IsNullOrWhiteSpace(item?.VendorPartNo))
                {
                    productId = item.VendorPartNo;
                }
                else
                {
                    productId = "";
                }
                item.VendorPartNo = productId;
                item.Manufacturer = item.Manufacturer ?? system;
                manufacturer = item.Manufacturer ?? system;
                i++;

                BuildQueryString(productId, ref sbManufacturer, ref sbVendorPart, item);
            }
            // Pass Details=True as paramere next push
            var url = _appProductServiceURL.AppendPathSegment("Find") + "?&Details=False&SalesOrganization=0100&PageSize=" + i + sbVendorPart.ToString() + sbManufacturer.ToString();
            return url;
        }

        private void BuildQueryString(string productId, ref StringBuilder sbManufacturer, ref StringBuilder sbVendorPart, Line item)
        {
            if (!string.IsNullOrWhiteSpace(productId))
            {
                if (sbManufacturer.ToString().Contains(item.Manufacturer) == false)
                {
                    sbManufacturer = sbManufacturer.Append("&Manufacturer=" + item.Manufacturer);
                }
                if (sbVendorPart.ToString().Contains(productId) == false)
                {
                    sbVendorPart = sbVendorPart.Append("&MfrPartNumber=" + productId);
                }
            }
        }

        /// <summary>
        /// Map Order / Quote Lines 
        /// </summary>
        /// <param name="product"></param>
        /// <param name="line"></param>
        private void MapLines(ProductsModel product, Line line, string source)
        {
            source = source ?? string.Empty;
            line.ShortDescription = string.IsNullOrWhiteSpace(product.ShortDescription) ? line.ShortDescription : product.ShortDescription;
            line.DisplayName = string.IsNullOrWhiteSpace(product.DisplayName) ? line.ShortDescription : product.DisplayName;
            line.TDNumber = product?.Source.ID;
            line.URLProductImage = GetImageUrlForProduct(product);
            line.Images = product.Images;
            line.Logos = product.Logos;
            line.MFRNumber = product?.ManufacturerPartNumber;
            line.Authorization = MapAutorization(product?.Authorization);
        }

        /// <summary>
        /// Map Order / Quote Lines 
        /// </summary>
        /// <param name="product"></param>
        /// <param name="line"></param>
        public AuthorizationModel MapAutorization(AuthorizationModel authorization)
        {
            AuthorizationModel auth = new AuthorizationModel();
            if (authorization is null)
            {
                auth.CustomerCanView = false;
                auth.CanOrder = false;
                auth.CanViewPrice = false;
            }
            else
            {
                auth.CustomerCanView = authorization.CustomerCanView;
                auth.CanOrder = authorization.CustomerCanView;
                auth.CanViewPrice = authorization.CustomerCanView;
            }
            return auth;
        }


        /// <summary>
        /// Returns Image URL
        /// </summary>
        /// <param name="product"></param>
        /// <returns></returns>
        private string GetImageUrlForProduct(ProductsModel product)
        {
            string url = ProductUrlUsingImages(product);
            url = !string.IsNullOrWhiteSpace(url) ? url : ProducUrlUsingLogo(product);
            return url;
        }

        private string ProducUrlUsingLogo(ProductsModel product)
        {
            if (product.Logos != null && product.Logos.Count > 0)
            {
                if (product?.Logos?.Count == 1)
                    return product?.Logos.FirstOrDefault().Value?.FirstOrDefault().Url;
                else if (product.Logos.Any(a => a.Key == "75x75"))
                    return product.Logos.Where(a => a.Key == "75x75").FirstOrDefault().Value.FirstOrDefault().Url;
                else
                    return product?.Logos.FirstOrDefault().Value?.FirstOrDefault().Url;
            }
            else
                return string.Empty;
        }

        private string ProductUrlUsingImages(ProductsModel product)
        {
            if (product.Images != null && product.Images.Count > 0)
            {
                if (product?.Images?.Count == 1)
                    return product?.Images.FirstOrDefault().Value?.FirstOrDefault().Url;
                else if (product.Images.Any(a => a.Key == "75x75"))
                    return product.Images.Where(a => a.Key == "75x75").FirstOrDefault().Value.FirstOrDefault().Url;
                else
                    return product?.Images.FirstOrDefault().Value?.FirstOrDefault().Url;
            }
            else
                return string.Empty;
        }


        public string GetCheckoutSystem(SourceModel source)
        {

            if (source?.System?.ToUpper() == "Q" && source?.TargetSystem?.ToUpper() == "ECC")
                return "6.8";
            else
                return "4.6";
        }

        public Models.Order.Internal.OrderModel FilterOrderLines(Models.Order.Internal.OrderModel orderDetail)
        {
            if (orderDetail.Source?.System == "3") // for 6.8 orders return all lines
                return orderDetail;
            else
            {
                orderDetail = FilterOrderKitLines(orderDetail);
                orderDetail = FilterOrderGATPLines(orderDetail);
            }
            return orderDetail;
        }

        private Models.Order.Internal.OrderModel FilterOrderGATPLines(Models.Order.Internal.OrderModel orderDetail)
        {
            var parents = orderDetail.Items.Where(i => i.Parent == "0" || i.Parent == null).ToList().OrderBy(o => o.ID);

            Parallel.ForEach(parents,
                new ParallelOptions { MaxDegreeOfParallelism = 3 }, line =>
                {
                    if (line.POSType?.ToUpper() == "AH")
                    {
                        var subLines = orderDetail.Items.Where(i => (i.Parent == line.ID && i.POSType?.ToUpper() == "AI"))?.ToList();
                        if (subLines.Count == 1)
                        {
                            MovePaymentInformation(line, subLines);
                            MapShipments(line, subLines);
                            MapSerials(line, subLines);
                            MapInvoices(line, subLines);
                            // remove AI line 
                            orderDetail.Items.Remove(subLines.FirstOrDefault());
                        }
                        else
                        {
                            line.Freight = 0.00M;
                            line.OtherFees = 0.00M;
                            line.Tax = 0.00M;
                        }
                    }
                });

            return orderDetail; /// Fix this 
        }
        private void MovePaymentInformation(Item line, List<Item> subLines)
        {

            line.Freight =  subLines.FirstOrDefault()?.Freight ?? 0.00M;
            line.OtherFees =  subLines.FirstOrDefault()?.OtherFees ?? 0.00M;
            line.Tax =  subLines.FirstOrDefault()?.Tax ?? 0.00M;

        }
        private void MapSerials(Item line, List<Item> subLines)
        {

            var serials = new List<string>();
            if (line.Serials != null && line.Serials?.Count > 0)
                serials = line.Serials;

            if (subLines?.FirstOrDefault()?.Serials != null && subLines?.FirstOrDefault()?.Serials?.Count > 0)
                serials.AddRange(subLines?.FirstOrDefault()?.Serials.Except(serials)); // avoid duplicates while adding serial number

            line.Serials = serials;

        }

        private void MapShipments(Item line, List<Item> subLines)
        {
            var shipments = new List<ShipmentModel>();

            if (line.Shipments != null && line.Shipments?.Count > 0)
                shipments = line.Shipments;

            if (subLines?.FirstOrDefault()?.Shipments != null && subLines?.FirstOrDefault()?.Shipments?.Count > 0)
            {
                foreach (var shipment in subLines.FirstOrDefault().Shipments)
                {
                    if ((!string.IsNullOrWhiteSpace(shipment.TrackingNumber) && shipments.Where(x => x.TrackingNumber == shipment.TrackingNumber).Count() == 0))
                        shipments.Add(shipment);
                }
            }

            line.Shipments = shipments;
        }

        private void MapInvoices(Item line, List<Item> subLines)
        {
            var invoices = new List<InvoiceModel>();

            if (line.Invoices != null && line.Invoices?.Count > 0)
                invoices = line.Invoices;

            if (subLines?.FirstOrDefault()?.Invoices != null && subLines?.FirstOrDefault()?.Invoices?.Count > 0)
            {

                foreach (var invoice in subLines?.FirstOrDefault()?.Invoices)
                {
                    if (invoices.Where(x => x.ID == invoice.ID).Count() == 0)
                        invoices.Add(invoice);
                }
            }

            line.Invoices = invoices;
        }

        private Models.Order.Internal.OrderModel FilterOrderKitLines(Models.Order.Internal.OrderModel orderDetail)
        {
            orderDetail.Items = orderDetail.Items.Where(i => i.POSType?.ToUpper() != "KC").ToList();
            return orderDetail;
        }
    }
}
