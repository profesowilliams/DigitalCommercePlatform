//2022 (c) Tech Data Corporation - All Rights Reserved.

using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.Profile;
using DigitalCommercePlatform.UIServices.Search.Models.Profile;

namespace DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles
{
    public class SearchProfileProfile : Profile
    {
        public SearchProfileProfile()
        {
            CreateMap<SearchProfileModel, SearchProfileDto>().ReverseMap();
            CreateMap<CultureProfileDto, CultureProfileModel>();
        }
    }
}