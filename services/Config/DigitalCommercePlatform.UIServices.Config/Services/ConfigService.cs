using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    [ExcludeFromCodeCoverage]
    public class ConfigService : IConfigService
    {
        private static readonly Random getrandom = new Random();
        //private readonly string _appOrderServiceUrl;
#pragma warning disable CS0414 // The field is assigned but its value is never used
        private readonly string _appQuoteServiceUrl;
#pragma warning restore CS0414
        public ConfigService(IOptions<AppSettings> options)
        {
            //_appOrderServiceUrl = options?.Value.GetSetting("App.Order.Url");
            _appQuoteServiceUrl = options?.Value.GetSetting("App.Quote.Url");
        }
        public async Task<RecentConfigurationsModel> GetConfigurations(Models.Configurations.FindModel request)
        {
            var lstConfigurations = new List<Configuration>();
            for (int i = 0; i < 30; i++)
            {
                Configuration objConfiguration = new Configuration();
                var randomNumber = Convert.ToString(GetRandomNumber(1000, 6509));
                objConfiguration.ConfigId = "Dummy-Configuration : " + randomNumber;
                objConfiguration.ConfigurationType = i % 2 == 0 ? "Cart" : i % 5 == 0 ? "Favorite" : "Vendor Quote";
                objConfiguration.Vendor = i % 2 == 0 ? "HP" : i % 5 == 0 ? "Dell" : "Intel";
                objConfiguration.TdQuoteId = i < 2 ? "" : objConfiguration.ConfigurationType != "Vendor Quote" ? Convert.ToString(GetRandomNumber(20000000, 50000000)) : "";
                objConfiguration.VendorQuoteId = i > 2 ? "" : objConfiguration.ConfigurationType == "Vendor Quote" ? Convert.ToString(GetRandomNumber(50000000, 90000000)) + "VQ" : "";
                objConfiguration.ConfigName = i % 2 == 0 ? "HP Config " : i % 5 == 0 ? "Dell Config" : "";
                objConfiguration.EndUserName = i % 2 == 0 ? "SHI International" : i % 5 == 0 ? "CDW International" : "Davidson Russel Holdings";
                objConfiguration.Action = string.IsNullOrWhiteSpace(objConfiguration.VendorQuoteId) && string.IsNullOrWhiteSpace(objConfiguration.TdQuoteId) ? "Create Quote" : "Update Quote";
                objConfiguration.CreatedOn = DateTime.Now.AddDays(i * -5);
                lstConfigurations.Add(objConfiguration);
            }

            var objResponse = new RecentConfigurationsModel
            {
                Items = lstConfigurations,
                TotalRecords = lstConfigurations.Count(),
                SortBy = request.SortBy,
                SortDirection = "desc", // fix this
                PageSize = 25,
                CurrentPage = 10,
            };
            return await Task.FromResult(objResponse);
        }
        public async Task<Models.Deals.RecentDealsModel> GetDeals(Models.Deals.FindModel request)
        {
            var lstDeals = new List<Deal>();
            for (int i = 0; i < 30; i++)
            {
                Deal objDeal = new Deal();
                var randomNumber = Convert.ToString(GetRandomNumber(1000, 6509));
                objDeal.DealId = "Dummy-Deals : " + randomNumber;
                objDeal.Vendor = i % 2 == 0 ? "HP" : i % 5 == 0 ? "Dell" : "Intel";
                objDeal.TdQuoteId = i < 2 ? "" : objDeal.Vendor != "Dell" ? Convert.ToString(GetRandomNumber(20000000, 50000000)) : "";
                objDeal.Description = i % 2 == 0 ? objDeal.DealId + "-" + Convert.ToString(GetRandomNumber(20000000, 50000000)) : "Deal from - " + objDeal.Vendor;
                objDeal.EndUserName = i % 2 == 0 ? "SHI International" : i % 5 == 0 ? "CDW International" : "Davidson Russel Holdings";
                objDeal.Action = string.IsNullOrWhiteSpace(objDeal.TdQuoteId) ? "Create Quote" : "Update Quote";
                objDeal.CreatedOn = DateTime.Now.AddDays(i * -5);
                lstDeals.Add(objDeal);
            }

            var objReponse = new RecentDealsModel
            {
                Items = lstDeals,
                TotalRecords = lstDeals.Count(),
                SortBy = request.SortBy,
                SortDirection = "desc", // fix this
                PageSize = 25,
                CurrentPage = 10,
            };
            return await Task.FromResult(objReponse);
        }

        public async Task<DealsDetailModel> GetDealDetails(Models.Deals.FindModel request)
        {
            var lstMaterials = new List<MaterialInformation>();
            for (int i = 1; i < 16; i++)
            {
                MaterialInformation material = new MaterialInformation();
                material.Allowance = i % 2 == 0 ? GetRandomNumber(50, 10000).ToString() + ".65" : GetRandomNumber(10, 40).ToString() + ".36";
                material.AllowanceType = i % 2 == 0 ? "% OFF LIST PRICE" : i % 5 == 0 ? "$ OFF LIST PRICE" : "";
                material.MaximumQuantityPerCustomer = GetRandomNumber(50, 1000);
                material.RemainingQuantity = material.MaximumQuantityPerCustomer - GetRandomNumber(0, 25);
                material.HasErrors = false;
                material.MinimumQuantity = GetRandomNumber(0, 5).ToString();
                material.MaximumQuantity = 2000;
                material.Description = "ransition Networks Stand-Alone 10...";
                material.VendorPartNumber = "SBFTF1011-105-NA";
                material.TDPartNumber = "1227948" + i;
                lstMaterials.Add(material);
            }
            var objResponse = new DealsDetailModel();

            objResponse.EndUserName = "OPEN TO ALL END USERS";
            objResponse.Vendor = "ERGOTRON INC";
            objResponse.VendorBidNumber = "3072898";
            objResponse.Reference = "0002989968";
            objResponse.ReferenceNumber = "028";
            objResponse.TotalResultCount = lstMaterials.Count();
            objResponse.Prodcuts = lstMaterials;
            objResponse.InvalidTDPartNumbers = null;
            
            return await Task.FromResult(objResponse);

        }
        public static int GetRandomNumber(int min, int max)
        {
            return getrandom.Next(min, max);
        }

    }
}
