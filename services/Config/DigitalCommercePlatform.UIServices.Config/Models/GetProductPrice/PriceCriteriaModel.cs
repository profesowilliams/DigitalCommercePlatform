//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice
{
    [ExcludeFromCodeCoverage]
    public class PriceCriteriaModel
    {
        public string Customer { get; set; }
        public CurrencyOptions? Currency { get; set; }
        [OrderLevelValidator]
        public string OrderLevel { get; set; }
        public string SalesOrg { get; set; }
        public IEnumerable<ProductRequestModel> Products { get; set; }
        public bool Details { get; set; }
        public bool IncludeQuantityBreaks { get; set; }
        public bool IncludePromotionOptions { get; set; }
    }

    public class OrderLevelValidatorAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
            if (value == null || string.IsNullOrWhiteSpace(value.ToString()))
                return true;

            return Enum.GetValues<PriceOrderLevel>().Any(val => string.Equals(value.ToString(), val.ToString(), StringComparison.InvariantCultureIgnoreCase));
        }
    }
}
