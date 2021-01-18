using DigitalFoundation.Core.Models.DTO.Common;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Models.Search
{
    public class TypeAheadResponse 
    {
        public TypeAheadRequest Request { get; set; }
        public TypeAheadSuggestion[] Suggestions { get; set; }
    }
}