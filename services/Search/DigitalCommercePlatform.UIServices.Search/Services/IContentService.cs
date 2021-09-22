//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalCommercePlatform.UIServices.Search.Models.Content.App;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IContentService
    {
        public Task<ContentSearchResponseDto> GetContentData(AppFullSearchRequestModel request);
    }
}
