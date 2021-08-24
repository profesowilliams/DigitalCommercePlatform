//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Accounts
{
    [ExcludeFromCodeCoverage]

    public class SalesDivision
    {
        public string SalesDivisionCode { get; set; }
        public string SalesOrg { get; set; }
        public IEnumerable<string> CustomerGroupCodes { get; set; }
    }
}
