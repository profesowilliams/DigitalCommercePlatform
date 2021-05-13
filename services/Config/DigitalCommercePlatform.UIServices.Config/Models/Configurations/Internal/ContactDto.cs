using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactDto
    {
        public string Salutation { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Initial { get; set; }
        public string EmailAddress { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
    }
}
