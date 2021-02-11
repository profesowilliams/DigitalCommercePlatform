using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Models
{
    public class Renewal
    {
        public string RenewalId { get; set; }
        public string VendorName { get; set; }
        public string RenewalNumber { get; set; }
        public DateTime ExpirationDate { get; set; }
        public string ExpirationDateToString { get; set; }
        public string QuoteNumber { get; set; }
        public int Quantity { get; set; }
        public Double Price { get; set; }
        public string FormatedPrice { get; set; }
        public Double TotalPrice { get; set; }
        public string FormatedTotalPrice { get; set; }
        public string EndUserName { get; set; }
        public string ContractNumber { get; set; }
        public string TDPartNumber { get; set; }
        public string PartDescription { get; set; }
        public DateTime CreatedTime { get; set; }
        public DateTime UpdatedTime { get; set; }
        public string Action { get; set; } 
        
    }
}
