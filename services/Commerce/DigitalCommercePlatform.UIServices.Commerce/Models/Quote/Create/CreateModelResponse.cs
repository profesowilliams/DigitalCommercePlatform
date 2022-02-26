//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create
{
    [ExcludeFromCodeCoverage]
    public class CreateModelResponse
    {
        public string Id { get; set; }
        public string Confirmation { get; set; }
        public IEnumerable<MessageModel> Messages { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Message
    {
        public object Code { get; set; }
        public string Value { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ErrorDetail
    {
        public string Id { get; set; }
        public string Confirmation { get; set; }
        public List<Message> Messages { get; set; }
    }
}
