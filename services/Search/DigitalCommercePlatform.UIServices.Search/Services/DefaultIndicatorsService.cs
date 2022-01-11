//2022 (c) Tech Data Corporation - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;
using DigitalFoundation.Common.Providers.Settings;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IDefaultIndicatorsService
    {
        List<RefinementGroupRequestDto> GetDefaultIndicators(SearchProfileId profileId);
    }

    public class DefaultIndicatorsService : IDefaultIndicatorsService
    {
        private const string ProductStatus = "ProductStatus";
        private const string DisplayStatus = "DisplayStatus";
        private const string Allocated = "Allocated";
        private const string PhasedOut = "PhasedOut";
        private const string Active = "Active";
        private const string AvailabilityType = "AvailabilityType";
        private const string InStock = "InStock";
        private readonly IProfileService _profileService;
        private readonly List<RefinementGroupRequestDto> _defaultIndicators;

        public DefaultIndicatorsService(ISiteSettings siteSettings, IProfileService profileService)
        {
            _profileService = profileService;

            _defaultIndicators = JsonHelper.DeserializeObjectSafely<List<RefinementGroupRequestDto>>(
                    value: siteSettings.TryGetSetting("Search.UI.DefaultIndicators")?.ToString(),
                    settings: JsonSerializerSettingsHelper.GetJsonSerializerSettings(),
                    defaultValue: new List<RefinementGroupRequestDto>() {
                        new RefinementGroupRequestDto(){
                            Group = AvailabilityType,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "DropShip" },
                                new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Warehouse" },
                                new RefinementRequestDto(){ Id = AvailabilityType, ValueId = "Virtual" }
                            }
                        },
                         new RefinementGroupRequestDto(){
                            Group = ProductStatus,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = DisplayStatus, ValueId = Allocated },
                                new RefinementRequestDto(){ Id = DisplayStatus, ValueId = PhasedOut },
                                new RefinementRequestDto(){ Id = DisplayStatus, ValueId = Active }
                            }
                        },
                         new RefinementGroupRequestDto(){
                            Group = InStock,
                            Refinements = new List<RefinementRequestDto>()
                            {
                                new RefinementRequestDto(){ Id = InStock, ValueId = "InStockOnly" }
                            }
                        }
                    });
        }

        public List<RefinementGroupRequestDto> GetDefaultIndicators(SearchProfileId profileId)
        {
            if (profileId is null || !profileId.HasValue)
                return _defaultIndicators;

            var profile = _profileService.GetSearchProfile(profileId);

            if (profile is null)
                return _defaultIndicators;

            ProcessProductStatusRefinements(profile);

            return _defaultIndicators;
        }

        private void ProcessProductStatusRefinements(SearchProfileModel profile)
        {
            var hasProductStatusRefinements = _defaultIndicators.Any(x => x.Group == ProductStatus);

            if (!hasProductStatusRefinements && !profile.NewStatusCode && !profile.ActiveStatusCode && !profile.AllocatedStatusCode && !profile.PhasedOutStatusCode)
                return;

            if (!hasProductStatusRefinements)
            {
                _defaultIndicators.Add(new RefinementGroupRequestDto
                {
                    Group = ProductStatus,
                    Refinements = new List<RefinementRequestDto>()
                });
            }

            var productStatusRefinements = _defaultIndicators.First(x => x.Group == ProductStatus);
            ProcessAllocatedRefinements(profile, productStatusRefinements);
            ProcessPhasedOutRefinements(profile, productStatusRefinements);
            ProcessActiveRefinements(profile, productStatusRefinements);

            _defaultIndicators.RemoveAll(x => x.Refinements is null || !x.Refinements.Any());
        }

        private static void ProcessAllocatedRefinements(SearchProfileModel profile, RefinementGroupRequestDto productStatusRefinements)
        {
            ProcessProducStatusRefinement(productStatusRefinements, profile.AllocatedStatusCode, Allocated);
        }

        private static void ProcessPhasedOutRefinements(SearchProfileModel profile, RefinementGroupRequestDto productStatusRefinements)
        {
            ProcessProducStatusRefinement(productStatusRefinements, profile.PhasedOutStatusCode, PhasedOut);
        }

        private static void ProcessActiveRefinements(SearchProfileModel profile, RefinementGroupRequestDto productStatusRefinements)
        {
            ProcessProducStatusRefinement(productStatusRefinements, profile.ActiveStatusCode, Active);
        }

        private static void ProcessProducStatusRefinement(RefinementGroupRequestDto productStatusRefinements, bool refinementShouldBeSet, string refinementValueId)
        {
            var refinement = productStatusRefinements.Refinements.FirstOrDefault(x => x.ValueId == refinementValueId);
            if (refinementShouldBeSet && refinement is null)
                productStatusRefinements.Refinements.Add(new RefinementRequestDto { Id = DisplayStatus, ValueId = refinementValueId });
            else if (!refinementShouldBeSet && refinement is not null)
                productStatusRefinements.Refinements.Remove(refinement);
        }
    }
}