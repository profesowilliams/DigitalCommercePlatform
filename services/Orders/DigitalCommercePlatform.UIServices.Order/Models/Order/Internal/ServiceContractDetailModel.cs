//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class ServiceContractDetailModel
    {
        public string BillStatus { get; set; }
        public decimal? BillPlanAmount { get; set; }
        public DateTime? BillPlanDate { get; set; }
    }
}
