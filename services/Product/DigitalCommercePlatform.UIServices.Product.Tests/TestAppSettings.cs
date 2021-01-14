using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Options;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Product.Tests
{
    public class TestAppSettings : IOptions<AppSettings>
    {
        public AppSettings Value
        {
            get
            {
                var settings = new AppSettings();
                settings.Configure(new Dictionary<string, string>()
                    {
                        {"Core.Product.Url","x" },
                        {"Core.Stock.Url","z" },
                        {"Core.Catalog.Url","y" }
                    });
                return settings;
            }
        }
    }
}