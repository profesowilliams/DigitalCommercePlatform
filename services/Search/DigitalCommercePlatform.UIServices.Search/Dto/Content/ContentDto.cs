//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.Content
{
    [ExcludeFromCodeCoverage]
    public class ContentDto
    {
        /// <summary>
        /// Page Number of Result.
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// Page Size.
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// Total Pages of Result.
        /// </summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// Total Records of Result.
        /// </summary>
        public int TotalResults { get; set; }

        /// <summary>
        /// List of Web Pages.
        /// </summary>
        public List<SearchResult> SearchResults { get; set; }

        /// <summary>
        /// List of Facet Data.
        /// </summary>
        public List<ContentFacetDto> Refinements { get; set; }

        public class SearchResult
        {
            /// <summary>
            /// The Type of Item
            /// </summary>
            public string Type { get; set; }

            /// <summary>
            /// Title of Web Page.
            /// </summary>
            public string Title { get; set; }

            /// <summary>
            /// The body of the page with the found text highlighted.
            /// </summary>
            public string Body { get; set; }

            /// <summary>
            /// Site Name.
            /// </summary>
            public string Site { get; set; }

            /// <summary>
            /// URL of Web Page.
            /// </summary>
            public string Url { get; set; }

            /// <summary>
            /// The last time this page or document was updated.
            /// </summary>
            public string LastUpdated { get; set; }

            /// <summary>
            /// The keywords for this site.
            /// </summary>
            public List<string> Keywords { get; set; }
        }
    }
}