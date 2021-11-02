//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
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
        public HelperService(ILogger<HelperService> logger,
                             IUIContext context,
                             IMiddleTierHttpClient middleTierHttpClient,
                             IAppSettings appSettings)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _context = context;
            _middleTierHttpClient = middleTierHttpClient;
            _appSettings = appSettings;
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
            if(string.IsNullOrWhiteSpace(orderType)) return Task.FromResult("Manual");            
            
            string response = "Manual";
            
            switch (orderType.ToUpper())
            {
                case var ot when new[] { "#:ZZOR", "ZZED:ZZED", "ZZEK:ZZED", "ZZED:ZZKE", "ZZOR", "ZZED","ZZKE", "ZZEK" }.Contains(ot):
                    response ="B2B";
                    break;
                case var ot when new[] { "#:ZZSB", "ZQ2O:ZZOR", "#:ZZDR", "ZZUP:ZZSB", "ZQ2O:ZZSB", "YIPO:ZZDR", "ZZSB", "ZQ2O", "ZZOR", "ZZDR", "ZZUP", "YIPO" }.Contains(ot):
                    response = "Manual";
                    break;
                case  var ot when new[] { "ZZWE:ZZIT", "ZZIT:ZZIT", "ZZLS:ZZIT", "DFUE:ZZST", "ZZYP:ZZIT", "ZZ1S:ZZIT", "ZZTB:ZZIT", "ZZST", "ZZWE", "ZZIT", "ZZLS", "DFUE", "ZZYP", "ZZ1S", "ZZTB" }.Contains(ot):
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
        public async Task<List<Line>> PopulateLinesFor(List<Line> items, string vendorName)
        {
            ProductData productDetails;
            string productUrl = BuildQueryForProductApiCall(items, vendorName);

            try
            {
                productDetails = await _middleTierHttpClient.GetAsync<ProductData>(productUrl);
                ProductsModel product;
                foreach (var line in items)
                {
                    product = productDetails.Data.Where(p => p.ManufacturerPartNumber == line.VendorPartNo).FirstOrDefault();
                    if (product != null && line != null)
                    {
                        MapLines(product, line);
                    }
                    else
                    {
                        line.DisplayName = string.IsNullOrWhiteSpace(line?.Description) ? string.Empty : line?.Description;
                        line.ShortDescription = line.DisplayName;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting product details : " + nameof(CommerceService));
            }

            return items;
        }


        /// <summary>
        /// returns Application product API call URL
        /// </summary>
        /// <param name="items"></param>
        /// <param name="vendorName"></param>
        /// <returns></returns>
        private string BuildQueryForProductApiCall(List<Line> items, string vendorName)
        {
            string _appProductServiceURL = _appSettings.GetSetting("App.Product.Url");
            string productUrl = "";
            string manufacturer = "";
            string system = vendorName;//configurationFindResponse?.Data?.FirstOrDefault()?.Vendor.Name;
            string[] arrProductIds = new string[items.Count];
            string[] arrManufacturer = new string[items.Count];
            string productId;

            //convert for-each statment to linq statment after App-Service is ready.
            int i = 0;
            foreach (var item in items)
            {
                //SetProductQuery(ref manufacturer, system, arrProductIds, arrManufacturer, ref i, item);
                
                productId = item?.VendorPartNo ?? item?.MFRNumber ?? ""; // Fix this once app service is ready
                if (!string.IsNullOrWhiteSpace(productId) && !arrProductIds.Contains(productId))
                {

                    item.VendorPartNo = productId; // this is temp solution till APP service start returning real data Fix this once app service is ready
                    item.Manufacturer = item.Manufacturer ?? system;
                    manufacturer = item.Manufacturer ?? system;
                    arrManufacturer[i] = manufacturer;
                    arrProductIds[i] = productId;
                    i++;
                }
            }

            arrManufacturer = arrManufacturer.Where(c => c != null).Distinct().Where(x => !string.IsNullOrEmpty(x)).ToList().ToArray();
            arrProductIds = arrProductIds.Where(c => c != null).Distinct().Where(x => !string.IsNullOrEmpty(x)).ToList().ToArray();
            // call product app service
            productUrl = _appProductServiceURL.AppendPathSegment("Find")
             .SetQueryParams(new
             {
                 MfrPartNumber = arrProductIds,
                 Details = true,
                 SalesOrganization = "0100",//_uiContext.User.ActiveCustomer.SalesDivision.FirstOrDefault().SalesOrg,//"0100"; Goran Needs to Fix this
                 Manufacturer = arrManufacturer
             });
            return productUrl;
        }

        /// <summary>
        /// Map Order / Quote Lines 
        /// </summary>
        /// <param name="product"></param>
        /// <param name="line"></param>
        private void MapLines(ProductsModel product, Line line)
        {
            line.ShortDescription = string.IsNullOrWhiteSpace(product.ShortDescription) ? line.ShortDescription : product.ShortDescription;
            line.DisplayName = string.IsNullOrWhiteSpace(product.DisplayName) ? line.ShortDescription : product.DisplayName;
            line.TDNumber = product?.Source.ID;
            line.URLProductImage = GetImageUrlForProduct(product);
            line.Images = product.Images;
            line.Logos = product.Logos;
            line.MSRP = product?.Price?.UnpromotedPrice;
            line.MFRNumber = product?.ManufacturerPartNumber;
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
                return  string.Empty;
        }

        private string ProductUrlUsingImages(ProductsModel product)
        {
            if ( product.Images != null && product.Images.Count > 0)
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

    }
}
