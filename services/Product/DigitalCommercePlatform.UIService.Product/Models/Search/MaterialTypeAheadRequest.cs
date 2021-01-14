using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIService.Product.Models.Search
{
	public class MaterialTypeAheadRequest
	{
		public int MaxResults { get; set; }
		public string SearchApplication { get; set; }
		public string Keyword { get; set; }
		public string CustomerGroup { get; set; }
	}
}