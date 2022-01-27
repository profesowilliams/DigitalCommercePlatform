//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces
{
    public interface IRenewalQuoteDetailsDocumentModel : IDocumentModel
    {
        public string Id { get; set; }
        public IList<QuoteDetailedModel> QuoteDetailedModels { get; set; }
    }
}
