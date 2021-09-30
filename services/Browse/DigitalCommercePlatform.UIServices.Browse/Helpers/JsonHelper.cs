//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    [ExcludeFromCodeCoverage]
    public static class JsonHelper
    {
        public static T DeserializeObjectSafely<T>(string value, JsonSerializerSettings settings, T defaultValue)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return defaultValue;
            }
            else
            {
                return JsonConvert.DeserializeObject<T>(value, settings);
            }
        }
    }
    [ExcludeFromCodeCoverage]
    public static class JsonSerializerSettingsHelper
    {
        public static JsonSerializerSettings GetJsonSerializerSettings()
        {
            return new JsonSerializerSettings { Error = (sender, args) => { args.ErrorContext.Handled = true; }, MissingMemberHandling = MissingMemberHandling.Error };
        }
    }
}
