using AutoMapper;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations.Resolvers
{
    public class SortByResolver : IValueResolver<Models.Configurations.FindModel, Models.Configurations.Internal.FindModel, bool>
    {
        public bool Resolve(Models.Configurations.FindModel source,
                            Models.Configurations.Internal.FindModel destination,
                            bool destMember,
                            ResolutionContext context)
        {
            if (string.IsNullOrWhiteSpace(source.SortDirection))
                return false;

            if (source.SortDirection.Equals("asc"))
                return true;

            return false;
        }
    }
}
