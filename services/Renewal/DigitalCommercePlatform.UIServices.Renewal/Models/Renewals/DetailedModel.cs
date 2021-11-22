//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals
{
    [ExcludeFromCodeCoverage]
    public class DetailedModel : SummaryModel
    {
        public List<ItemModel> Items { get; set; }
    }
}