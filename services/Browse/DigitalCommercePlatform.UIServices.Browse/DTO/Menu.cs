using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.DTO
{
    public class Menu
    {
        public string RediredctURL { get; set; }
        public string Description { get; set; }
        public string Title { get; set; }
        public string Private { get; set; }
        public string Parent { get; set; }
        public string image { get; set; }
        public IList<SubMenu> SubMenus { get; set; }
    }
}
