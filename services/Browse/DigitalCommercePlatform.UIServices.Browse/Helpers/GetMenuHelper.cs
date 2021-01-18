using Newtonsoft.Json;


namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    public static class GetMenuHelper
    {
        public static string GetMenu(string accountNumber)
        {
            string json = @"{
      'Name': 'name',
      'Description': 'des'
    }";

            var res = JsonConvert.DeserializeObject<dynamic>(json);

            return res.Name;
            // Response.Write(res.Name);

            //string file = @"..\DigitalCommercePlatform.UIServices.Browse\Menu-in-json.json";

            //var example1Model = new JsonSerializer().Deserialize<Menu>(file);

            //string jsonString;
            //jsonString = JsonSerializer.Serialize(weatherForecast);

            //string jsonfromFile;
            //using (var reader = new StreamReader(file))
            //{
            //    jsonfromFile = reader.ReadToEnd();
            //}
            //richTextBoxReadJson.Text = jsonfromFile;

            //var customerFromJson = JsonConvert.DeserializeObject<Menu>;


            //deserialize JSON from file  
            //string Json = System.IO.File.ReadAllText(file);
            //JavaScriptSerializer ser = new JavaScriptSerializer();
            //var personlist = ser.Deserialize<List<Menu>>(Json);
            //return View(personlist);

            //// read file
            //string jsonFilePath = @"..\DigitalCommercePlatform.UIServices.Browse\Menu-in-json.json";

            ////string json = File.ReadAllText(jsonFilePath);

            ////string Json = System.IO.File.ReadAllText(jsonFilePath);
            ////JavaScriptSerializer ser = new JavaScriptSerializer();
            ////var personlist = ser.Deserialize<List<Person>>(Json);
            ////return View(personlist);

            //using (StreamReader file = File.OpenText(jsonFilePath))
            //using (JsonTextReader reader = new JsonTextReader(file))
            //{
            //    JObject o2 = (JObject)JToken.ReadFrom(reader);
            //}


            // string fileName = File.ReadAllText(@"..\DigitalCommercePlatform.UIServices.Browse\Menu-in-json.json");
            // string weatherForecast = JsonSerializer.Deserialize<Menu>(jsonString);

            //using (FileStream fs = File.OpenRead(fileName))
            //{
            //    Menu = await JsonSerializer.DeserializeAsync<Menu>(fs);
            //}

            // var test = JsonSerializer.Deserialize<reader>(jsonFilePath);

            //Dictionary<string, object> json_Dictionary = (new JavaScriptSerializer()).Deserialize<Dictionary<string, object>>(json);

            //foreach (var item in json_Dictionary)
            //{
            //    // parse here
            //}

            //// foreach nod of json
            //var menu = new Menu();
            //var subMenu = new SubMenu();
            //var menuResponse = new SubMenu();

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
#pragma warning disable CS0162 // Unreachable code detected
            return "Created Menu for account # : " + accountNumber;
#pragma warning restore CS0162 // Unreachable code detected
        }

        
    }
}
