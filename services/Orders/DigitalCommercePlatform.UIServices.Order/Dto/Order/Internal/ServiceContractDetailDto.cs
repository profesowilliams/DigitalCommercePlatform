//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Order.Internal
{
    public class ServiceContractDetailDto
    {
        public string BillStatus { get; set; }
        public decimal? BillPlanAmount { get; set; }
        public DateTime? BillPlanDate { get; set; }
    }
}
