//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create
{
    [ExcludeFromCodeCoverage]
    public class CreateQuoteModel
    {
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string System { get; set; }
        public string EndUserPo { get; set; }
        public string CustomerPo { get; set; }
        public TypeModel Type { get; set; }
        public LevelModel Level { get; set; }
        public string Creator { get; set; }
        public ResellerModel Reseller { get; set; }
        public ShipToModel ShipTo { get; set; }
        public EndUserModel EndUser { get; set; }
        public VendorReferenceModel VendorReference { get; set; }
        public IEnumerable<ItemModel> Items { get; set; }
        public IEnumerable<AgreementModel> Agreements { get; set; }

    }
}
