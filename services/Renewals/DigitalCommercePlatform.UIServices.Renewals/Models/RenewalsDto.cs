using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewals.Models
{
    public class RenewalsDto
    {
        public List<Renewal> ListOfRenewals { get; set; }
        public int TotalRecords { get; set; }

        public string SortBy { get; set; } // columnName
        public string SortDirection { get; set; } // Ascending or Decnding
        public int PageSize { get; set; } // Ascending or Decnding
        public int CurrentPage { get; set; } // Ascending or Decnding
    }
}
