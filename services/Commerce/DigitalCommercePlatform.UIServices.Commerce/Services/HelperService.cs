//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalFoundation.Common.Contexts;
using Microsoft.Extensions.Logging;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    [ExcludeFromCodeCoverage]
    public class HelperService : IHelperService
    {
        private readonly ILogger<HelperService> _logger;
        private readonly IUIContext _context;

        public HelperService(ILogger<HelperService> logger,
                             IUIContext context)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _context = context;

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
    }
}
