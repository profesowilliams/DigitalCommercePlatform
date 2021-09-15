//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Search
{
	[ExcludeFromCodeCoverage]
	public class MaterialTypeAheadRequest
	{
		public int MaxResults { get; set; }
		public string SearchApplication { get; set; }
		public string Keyword { get; set; }
		public string CustomerGroup { get; set; }
	}
}
