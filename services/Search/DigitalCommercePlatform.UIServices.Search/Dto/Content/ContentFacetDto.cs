//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Dto.Content
{
    public class ContentFacetDto
    {
        /// <summary>
        /// The string representing this refinement (Site, Keyword, etc).
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// The name of the refinement.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Options.
        /// </summary>
        public List<RefinementOptionDto> Options { get; set; }
    }
}