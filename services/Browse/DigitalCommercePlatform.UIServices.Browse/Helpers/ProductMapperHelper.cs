//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    public static class ProductMapperHelper
    {
        public static Dictionary<string, IndicatorValueDto> ExtractFinalIndicators(IEnumerable<IndicatorDto> indicators, string salesOrg, string site)
        {
            var finalIndicators = new Dictionary<string, IndicatorValueDto>();
            if (indicators == null || !indicators.Any())
            {
                return finalIndicators;
            }

            var siteIndicators = indicators.FirstOrDefault(x => x.Context != null && string.Equals(x.Context.SalesOrganization, salesOrg, StringComparison.InvariantCultureIgnoreCase)
                                                                     && string.Equals(x.Context.Site, site, StringComparison.InvariantCultureIgnoreCase)
                                                                     && x.Context.Location == null)?.Values;

            AddContextIndicatorsToFinalIndicators(finalIndicators, siteIndicators);

            var salesOrgIndicators = indicators.FirstOrDefault(x => x.Context != null && string.Equals(x.Context.SalesOrganization, salesOrg, StringComparison.InvariantCultureIgnoreCase)
                                                                     && x.Context.Site == null
                                                                     && x.Context.Location == null)?.Values;

            AddContextIndicatorsToFinalIndicators(finalIndicators, salesOrgIndicators);

            var defaultIndicators = indicators.FirstOrDefault(x => x.Context == null || (x.Context.SalesOrganization == null
                                                                                            && x.Context.Site == null
                                                                                            && x.Context.Location == null))?.Values;

            AddContextIndicatorsToFinalIndicators(finalIndicators, defaultIndicators);

            return finalIndicators;
        }

        private static void AddContextIndicatorsToFinalIndicators(Dictionary<string, IndicatorValueDto> finalIndicators, IDictionary<string, IndicatorValueDto> siteIndicators)
        {
            if (siteIndicators == null)
                return;

            foreach (var entry in siteIndicators)
            {
                finalIndicators.TryAdd(entry.Key, entry.Value);
            }
        }
    }
}