using System;
using MediatR;
using AutoMapper;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalCommercePlatform.UIServices.Product.Models.Search;


namespace DigitalCommercePlatform.UIServices.Product.Actions.Product.Search
{
    [ExcludeFromCodeCoverage]
    public sealed class Search
    {
        public class Handler : IRequestHandler<TypeAheadRequest, TypeAheadResponse>
        {
            private readonly IMiddleTierHttpClient _client;
            private readonly ILogger<Handler> _logger;
            private readonly IMapper _mapper;
            private readonly string _typeSearchUrl;

            public Handler(IMapper mapper, IMiddleTierHttpClient client, ILogger<Handler> logger)
            {
                _mapper = mapper;
                _client = client;
                _logger = logger;
                _typeSearchUrl = "https://typeahead.techdata.com/kw2";
            }

            public async Task<TypeAheadResponse> Handle(TypeAheadRequest request, CancellationToken cancellationToken)
            {


                try
                {
                    _logger.LogInformation($"UIService.Product.FindProduct");
                    var url =$"{_typeSearchUrl}"
                             .BuildQuery(request); 

                    var data = await _client.GetAsync<TypeAheadResponse>(url).ConfigureAwait(false);
                    return data;

                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting product data in {nameof(FindProduct)}");
                    throw;
                }
            }
        }
    }
}
