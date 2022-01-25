//2021 (c) Tech Data Corporation -. All Rights Reserved.
namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    public enum PricingCondition
    {
        Commercial = 0,
        EducationStudentStaff = 1,
        EducationHigher = 2,
        EducationK12 = 3,
        EducationERateK12 = 4,
        Federal = 5,
        FederalGSA = 6,
        State = 7,
        Medical = 8,
        SEWPContract = 11,
    }

    public enum PricingOption
    {
        EduHigher ,
        EduK12 ,
        GovtState ,
        GovtFederal ,
        Medical ,
        Commercial
    }
}
