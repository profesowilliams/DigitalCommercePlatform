using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security.Models
{
    [ExcludeFromCodeCoverage]

    public class User
    {
        public string ID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public IEnumerable<string> Customers { get; set; }
        public IEnumerable<string> Roles { get; set; }
        //public string AccessToken { get; set; }
        //public string RefreshToken { get; set; }
        //public int ExpiresInSeconds { get; set; }
    }
}
