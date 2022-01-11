//2022 (c) Tech Data Corporation - All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Search.Models.Profile
{
    public record SearchProfileId(string Account, string UserId)
    {
        public bool HasValue
        {
            get
            {
                return !string.IsNullOrWhiteSpace(Account) && !string.IsNullOrWhiteSpace(UserId);
            }
        }
    }
}