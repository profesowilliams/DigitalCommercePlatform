//2021 (c) Tech Data Corporation - All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat
{
    [ExcludeFromCodeCoverage]
    public class NuanceWebChatRequest
    {
        public RequestHeader Header { get; set; }
        public RequestOrderQuery OrderQuery { get; set; }
    }
    
}
