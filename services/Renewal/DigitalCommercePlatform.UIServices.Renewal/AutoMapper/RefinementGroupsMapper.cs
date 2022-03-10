//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Models.RefinementGroup.RefinementsDto;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Renewal.AutoMapper
{
    public class RefinementGroupsMapper : Profile
    {
        public RefinementGroupsMapper()
        {
            CreateMap<RefinementGroupData, RefinementGroupsModel>()
                .ConvertUsing<RefinementGroupConverter>();
        }
    }

    public class RefinementGroupConverter : ITypeConverter<RefinementGroupData, RefinementGroupsModel>
    {
        public RefinementGroupsModel Convert(RefinementGroupData source, RefinementGroupsModel destination, ResolutionContext context)
        {
            destination = new RefinementGroupsModel
            {
                Group = "RenewalAttributes",
                Refinements = new List<RefinementsModel>()
            };

            if (source.IsEmpty)
                return destination;

            destination.Refinements.Add(GetVendor(source.VendorRefinements));
            destination.Refinements.Add(GetEndUserType(source.EndUserRefinements));
            destination.Refinements.Add(GetRenewalType(source.RenewalTypeRefinements));

            return destination;
        }

        private static RefinementsModel GetVendor(List<VendorRefinement> vendorData)
        {
            var options = new List<OptionsModel>();

            var groupedByVendor = vendorData.GroupBy(x => x.VendorName);
            foreach (var vendor in groupedByVendor)
            {
                var subOptions = vendor.Select(o => new OptionsBaseModel
                    {
                        Text = o.ProgramName,
                        SearchKey = "ProgramName"
                    }).ToList();

                var element = new OptionsModel
                {
                    Text = vendor.Key,
                    SubOptions = subOptions,
                    SearchKey = "VendorName"
                };

                options.Add(element);
            }

            return new RefinementsModel
            {
                Name = "Vendors and Programs",
                Options = options
            };
        }

        private static RefinementsModel GetEndUserType(List<EndUserRefinement> endUserData)
        {
            var result = new RefinementsModel
            {
                Name = "End user type",
                SearchKey = "EndUserType",
                Options = endUserData.Select(x => 
                    new OptionsModel 
                    { 
                        Text = x.EndUserType 
                    }).ToList()
            };

            return result;
        }

        private static RefinementsModel GetRenewalType(List<RenewalTypeRefinement> renewalTypeData)
        {
            RefinementsModel result = new()
            {
                Name = "Renewal Type",
                SearchKey = "Type",
                Options = renewalTypeData.Select(x =>
                    new OptionsModel
                    {
                        Text = x.Type
                    }).ToList()
            };

            return result;
        }
    }
}
