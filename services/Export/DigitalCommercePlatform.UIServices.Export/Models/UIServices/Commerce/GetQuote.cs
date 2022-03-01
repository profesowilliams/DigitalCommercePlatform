//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using MediatR;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce
{
    [ExcludeFromCodeCoverage]
    public sealed class GetQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public bool Details { get; set; }
            public string SessionId { get; set; }

            public Request(IReadOnlyCollection<string> id, bool details, string sessionId)
            {
                Id = id;
                Details = details;
                SessionId= sessionId;
            }
        }

        public class Response
        {
            public QuoteDetails Details { get; set; }
        }
    }
}
