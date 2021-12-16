//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ITranslationService
    {
        void FetchTranslations(string translationName, ref Dictionary<string, string> translationDict);

        string Translate(Dictionary<string, string> translationDict, string key, string fallback = null);
    }

    public class TranslationService : ITranslationService
    {
        private readonly ILogger<TranslationService> _logger;
        private readonly IStringLocalizer _stringLocalizer;

        public TranslationService(ILogger<TranslationService> logger, IStringLocalizer stringLocalizer)
        {
            _logger = logger;
            _stringLocalizer = stringLocalizer;
        }

        public void FetchTranslations(string translationName, ref Dictionary<string, string> translationDict)
        {
            try
            {
                if (translationDict is null)
                    translationDict = JsonConvert.DeserializeObject<Dictionary<string, string>>(_stringLocalizer[translationName]);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at FetchTranslations");
                translationDict = new Dictionary<string, string>();
            }
        }

        public string Translate(Dictionary<string, string> translationDict, string key, string fallback = null)
        {
            if (key is null || translationDict is null || !translationDict.TryGetValue(key, out var translation))
                return fallback ?? key;

            return translation;
        }
    }
}