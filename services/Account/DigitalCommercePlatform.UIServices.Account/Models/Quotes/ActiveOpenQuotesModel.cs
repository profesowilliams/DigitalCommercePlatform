//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Quotes
{
    [ExcludeFromCodeCoverage]
    public class ActiveOpenQuotesModel
    {
        public IList<OpenResellerItems> Items { get; set; }
    }
}
