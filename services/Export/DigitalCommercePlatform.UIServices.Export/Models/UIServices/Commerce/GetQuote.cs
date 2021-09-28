//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce
{
    [ExcludeFromCodeCoverage]
    public sealed class GetQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public IReadOnlyCollection<string> Id { get; set; }
            public bool Details { get; set; }

            public Request(IReadOnlyCollection<string> id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class Response
        {
            public QuoteDetails Details { get; set; }
        }
    }
}
