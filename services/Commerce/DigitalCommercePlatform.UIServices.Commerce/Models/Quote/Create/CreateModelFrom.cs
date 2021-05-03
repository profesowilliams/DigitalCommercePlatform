using DigitalCommercePlatform.UIServices.Commerce.Models.Enums;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create
{
    [ExcludeFromCodeCoverage]
    public class CreateModelFrom
    {
        public string CreateFromId { get; set; }
        public QuoteCreationSourceType CreateFromType { get; set; }
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string EndUserPo { get; set; }
        public string CustomerPo { get; set; }
        public TypeModel Type { get; set; }
        public LevelModel Level { get; set; }
        public string Creator { get; set; }

        public ShipToModel ShipTo { get; set; }
        public EndUserModel EndUser { get; set; }
        public VendorReferenceModel VendorReference { get; set; }
        public List<ItemModel> Items { get; set; }
        public List<AgreementModel> Agreements { get; set; }
        public int PricingCondition { get; set; }
    }
}
