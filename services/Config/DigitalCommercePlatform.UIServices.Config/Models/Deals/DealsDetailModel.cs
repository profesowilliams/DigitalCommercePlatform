using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    public class DealsDetailModel
    {
        public string EndUserName { get; set; }
        public string Vendor { get; set; }
        public string VendorBidNumber { get; set; }
        public string Reference { get; set; }
        public string ReferenceNumber { get; set; }
        public int TotalPageCount { get; set; }
        public int TotalResultCount { get; set; }
        public string  ExpirationDate { get; set; }
        public List<MaterialInformation> Prodcuts { get; set; }
        public List<string> InvalidTDPartNumbers { get; set; }
    }
}

