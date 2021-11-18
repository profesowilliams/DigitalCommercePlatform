//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal;
using DigitalFoundation.App.Services.Renewal.Dto.CoreQuote.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals
{
    [ExcludeFromCodeCoverage]
    public class SummaryDto : BaseDto
    {
        public SourceDto Source { get; set; }
        public string EndUserType { get;  set; }
        public VendorDto Vendor { get; set; }
        public string ProgramName { get; set; }
        public PartyDto Reseller { get; set; }
        public PartyDto EndUser { get; set; }
        public PartyDto ShipTo { get; set; }
        public string RenewedDuration { get; set; }
    }
}