using DigitalCommercePlatform.UIServices.Browse.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    public static class GetMenuHelper
    {
        public static string GetMenu(string accountNumber)
        {
            // read file
            // foreach nod of json
            var menu = new Menu();
            var subMenu = new SubMenu();
            var menuResponse = new SubMenu();

            //foreach (var item in collection)
            //{
            //    menu = new Menu();
            //    foreach (var sm in subMenus)
            //    {

            //        subMenu = new SubMenu();
            //        foreach (var item in collection)
            //        {

            //        }
            //    }
            //    menu.SubMenus.Add(sm);
            //}
            return "Created Menu for account # : " + accountNumber; 
        }

        
    }
}
