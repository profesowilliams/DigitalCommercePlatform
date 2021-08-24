//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Deals.Resolvers
{
    public class SortByResolver : IValueResolver<Models.Deals.FindModel, Models.Deals.Internal.FindModel, bool>
    {
        public bool Resolve(Models.Deals.FindModel source,
                            Models.Deals.Internal.FindModel destination,
                            bool destMember,
                            ResolutionContext context)
        {
            if (source == null)
                return false;

            if (source.SortDirection == Models.Common.SortDirection.asc)
                return true;

            return false;
        }
    }
}
