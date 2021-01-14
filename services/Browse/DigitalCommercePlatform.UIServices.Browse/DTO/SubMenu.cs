using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.DTO
{
    public class SubMenu
    {
        public string RediredctURL { get; set; }
        public DateTime LastModified { get; set; }
        public string Description { get; set; }
        public string Title { get; set; }
        public string Private { get; set; }
        public string Parent { get; set; }
        public string Image { get; set; }
        public IList<SubMenu> SubMenus { get; set; }
    }
}
