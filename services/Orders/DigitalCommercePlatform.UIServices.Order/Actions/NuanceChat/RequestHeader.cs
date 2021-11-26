//2021 (c) Tech Data Corporation - All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat
{
    [ExcludeFromCodeCoverage]
    public class RequestHeader
    {
        public string ResellerId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string EcId { get; set; }
        public string Hmac { get; set; }
    }
}
