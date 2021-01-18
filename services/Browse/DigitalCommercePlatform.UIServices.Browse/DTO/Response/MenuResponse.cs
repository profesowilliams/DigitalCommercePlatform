using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Response
{
    public class MenuResponse
    {
        public string Country { get; set; }
        public string SalesOrganization { get; set; }
        public string Language { get; set; }
        public string TenantId { get; set; }
        public string Site { get; set; }       
        public bool Cache { get; set; }
        public IList<Menu> Menus { get; set; }
    }
}
