using DigitalCommercePlatform.UIServices.Account.Models.Accounts;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class AuthenticateModel
    {
        public User User { get; internal set; }
        public bool IsValidUser { get; internal set; }
        public string Message { get; internal set; }
    }
}
