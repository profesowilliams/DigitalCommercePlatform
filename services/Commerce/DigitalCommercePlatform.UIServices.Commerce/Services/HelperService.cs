using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalFoundation.Common.Contexts;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{

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
                    Value = response.Level
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
                    Value = ""
                };
            }


            return true;
        }
        
        private OrderPricingCondtionMapping GetOrderPricingConditionMappings(string pricingConditionId)
        {
            List<OrderPricingCondtionMapping> pricingDetails = new List<OrderPricingCondtionMapping>
                {
                    new OrderPricingCondtionMapping {Id ="0",  Type ="", TypeId="", Level="", LevelId="", SalesOrganization = "0100", Site="US", Description="Commercial"},
                    new OrderPricingCondtionMapping { Id ="1",  Type ="001", TypeId="", Level="EF", LevelId="", SalesOrganization = "0100", Site="US", Description="Education (Student & Staff)" },
                    new OrderPricingCondtionMapping { Id ="2",  Type ="001", TypeId="", Level="EH", LevelId="", SalesOrganization = "0100", Site="US", Description="Education (Higher)" },
                    new OrderPricingCondtionMapping { Id ="3",  Type ="001", TypeId="", Level="EL", LevelId="", SalesOrganization = "0100", Site="US", Description="Education (K-12)" },
                    new OrderPricingCondtionMapping { Id ="4",  Type ="001", TypeId="", Level="ER", LevelId="", SalesOrganization = "0100", Site="US", Description="Education (Erate)" },
                    new OrderPricingCondtionMapping { Id ="5",  Type ="001", TypeId="", Level="FE", LevelId="", SalesOrganization = "0100", Site="US", Description="Federal" },
                    new OrderPricingCondtionMapping { Id ="6",  Type ="001", TypeId="", Level="FG", LevelId="", SalesOrganization = "0100", Site="US", Description="Federal GSA" },
                    new OrderPricingCondtionMapping { Id ="7",  Type ="001", TypeId="", Level="ST", LevelId="", SalesOrganization = "0100", Site="US", Description="State" },
                    new OrderPricingCondtionMapping { Id ="8",  Type ="001", TypeId="", Level="MD", LevelId="", SalesOrganization = "0100", Site="US", Description="Medical" },
                    new OrderPricingCondtionMapping { Id ="11", Type ="001", TypeId="", Level="S5", LevelId="", SalesOrganization = "0100", Site="US", Description="SEWP Contract" },
                };

            //var response = pricingDetails.Where(p => p.Id == pricingConditionId).Any() ? pricingDetails.Where(p => p.Id == pricingConditionId && p.SalesOrganization == _context.User.ActiveCustomer.SalesOrganization).FirstOrDefault() : pricingDetails.Where(p => p.Id == "0").FirstOrDefault();
            var response = pricingDetails.Where(p => p.Id == pricingConditionId).Any() ? pricingDetails.Where(p => p.Id == pricingConditionId && p.SalesOrganization == "0100").FirstOrDefault() : pricingDetails.Where(p => p.Id == "0").FirstOrDefault();
            return response;
        }

    }
}
