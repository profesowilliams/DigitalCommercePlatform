//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface ITranslationService
    {
        void FetchTranslations(string translationName, ref Dictionary<string, string> translationDict);

        string Translate(Dictionary<string, string> translationDict, string key, string fallback = null);
        FullSearchResponseModel TranslateRefinementCountries(FullSearchResponseModel response);
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

        public FullSearchResponseModel TranslateRefinementCountries(FullSearchResponseModel response)
        {
            if (response?.TopRefinements == null || !response.TopRefinements.Any(x => x.Id == RefinementConstants.Countries)) { return response; }

            Dictionary<string, string> countriesTranslations = null;
            this.FetchTranslations("Search.UI.InternalRefinements", ref countriesTranslations);
            foreach (var option in response?.TopRefinements?.First(x => x.Id == RefinementConstants.Countries).Options)
            {
                option.Text = this.Translate(countriesTranslations, option.Id);
            }
            return response;
        }
    }
}