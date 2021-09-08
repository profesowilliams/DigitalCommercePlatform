//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemModel : ItemModelBase
    {
        public string Group { get; set; }
        public string Solution { get; set; }
        public decimal ConfirmedQuantity { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public DateTime Updated { get; set; }
        public List<MarginModel> Margins { get; set; }
        public DateTime Requested { get; set; }
        public string ShippingCondition { get; set; }
        public string ShipFrom { get; set; }
        public DirectorModel Director { get; set; }
        public DivisionManagerModel DivisionManager { get; set; }
        public BusinessManagerModel BusinessManager { get; set; }
        public List<AgreementModel> Agreements { get; set; }
    }
}
