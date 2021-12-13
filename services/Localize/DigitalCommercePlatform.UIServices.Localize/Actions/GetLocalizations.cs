//2021 (c) Tech Data Corporation -. All Rights Reserved.
using MediatR;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Localize.Actions
{
    public class GetLocalizations
    {
        public class Request : IRequest<Dictionary<string, Dictionary<string, string>>>
        {
            public string[] Ids { get; set; }

            public Request(string[] ids)
            {
                Ids = ids;
            }
        }

        public class Handler : IRequestHandler<Request, Dictionary<string, Dictionary<string, string>>>
        {
            private readonly IStringLocalizer _stringLocalizer;
            private readonly ILogger<Handler> _logger;

            public Handler(IStringLocalizer stringLocalizer, ILogger<Handler> logger)
            {
                _stringLocalizer = stringLocalizer;
                _logger = logger;
            }

            public Task<Dictionary<string, Dictionary<string, string>>> Handle(Request request, CancellationToken cancellationToken)
            {
                var results = new Dictionary<string, Dictionary<string, string>>();

                foreach (var id in request.Ids)
                {
                    var localizations = GetLocalizations(id);
                    Merge(results, localizations);
                }

                return Task.FromResult(results);
            }

            private KeyValuePair<string, Dictionary<string, string>> GetLocalizations(string id)
            {
                try
                {
                    var localizations = _stringLocalizer[id];
                    if (TryParse(localizations, out var parsedLocalizations))
                        return new KeyValuePair<string, Dictionary<string, string>>(id, parsedLocalizations);

                    if (!id.Contains("-"))
                        return new KeyValuePair<string, Dictionary<string, string>>(id, new Dictionary<string, string> { { id, localizations } });

                    var idParts = id.Split('-');
                    return new KeyValuePair<string, Dictionary<string, string>>(idParts[0], new Dictionary<string, string> { { idParts[1], localizations } });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Exception at GetByNamespace.Handler.GetLocalizations with id: {id}");
                    return new KeyValuePair<string, Dictionary<string, string>>(id, new Dictionary<string, string> { { id, id } });
                }
            }

            private bool TryParse(string value, out Dictionary<string, string> parsedValue)
            {
                try
                {
                    parsedValue = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, string>>(value);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Exception at GetByNamespace.Handler.TryParse with value: {value}");
                    parsedValue = null;
                    return false;
                }
            }

            private static void Merge(Dictionary<string, Dictionary<string, string>> results, KeyValuePair<string, Dictionary<string, string>> translations)
            {
                if (!results.TryGetValue(translations.Key, out var values))
                {
                    results.Add(translations.Key, translations.Value);
                    return;
                }

                foreach (var value in translations.Value)
                {
                    if (values.ContainsKey(value.Key))
                        continue;

                    values.Add(value.Key, value.Value);
                }
            }
        }
    }
}