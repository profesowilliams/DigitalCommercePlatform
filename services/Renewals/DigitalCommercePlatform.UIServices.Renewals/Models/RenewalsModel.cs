using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Renewals.Models
{
    public class RenewalsModel
    {
        public List<Renewal> ListOfRenewals { get; set; }
        public int TotalRecords { get; set; }
        public string SortBy { get; set; } // columnName
        public string SortDirection { get; set; } // Ascending or Decnding
        public int PageSize { get; set; } // Ascending or Decnding
        public int CurrentPage { get; set; } // Ascending or Decnding

    }
}
