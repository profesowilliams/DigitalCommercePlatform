//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Accounts
{
    [ExcludeFromCodeCoverage]

    public class Customer
    {
        public string Number { get; set; }
        public string Name { get; set; }
        public string CustomerNumber { get; set; }
        public string CustomerName { get; set; }
        public string SalesOrg { get; set; }
        public string System { get; set; }
    }
}
