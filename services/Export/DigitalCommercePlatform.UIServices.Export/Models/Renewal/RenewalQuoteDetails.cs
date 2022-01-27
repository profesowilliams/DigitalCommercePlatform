//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal
{
    public class RenewalQuoteDetails : IRenewalQuoteDetailsDocumentModel
    {
        public string Id { get; set; }
        public IList<QuoteDetailedModel> QuoteDetailedModels { get; set; }
    }
}
