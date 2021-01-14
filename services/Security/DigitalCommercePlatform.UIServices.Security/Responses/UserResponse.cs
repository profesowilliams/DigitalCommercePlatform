using DigitalCommercePlatform.UIServices.Security.Models;
using Newtonsoft.Json;
using System.Net;

namespace DigitalCommercePlatform.UIServices.Security.Responses
{
    public class UserResponse
    {
        public User User { get; set; }

        [JsonIgnore]
        public HttpStatusCode HttpStatusCode { get; set; }
    }
}
