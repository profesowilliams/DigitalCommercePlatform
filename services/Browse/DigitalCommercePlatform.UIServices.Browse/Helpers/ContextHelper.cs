//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    public static class ContextHelper
    {
        public static (string salesOrg, string site) ExtractSiteAndSalesOrgFromContext(IUIContext context, IList<SalesOrg> salesOrg)
        {
            var activeCustomerSalesOrgs = context?.User?.ActiveCustomer?.SalesDivision?.Select(x => x.SalesOrg);
            var activeCustomeruserSystem = context?.User?.ActiveCustomer?.System;

            var contextSalesOrg = salesOrg.FirstOrDefault(x => x.System == activeCustomeruserSystem && (activeCustomerSalesOrgs?.Contains(x.Value) ?? false));

            return (contextSalesOrg.Value, context?.Site);
        }
    }
}