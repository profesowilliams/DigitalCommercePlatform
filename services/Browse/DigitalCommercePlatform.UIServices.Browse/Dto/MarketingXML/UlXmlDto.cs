//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Xml.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.MarketingXML
{
    [ExcludeFromCodeCoverage]
    [XmlRoot(ElementName = "ul")]
    public class UlXmlDto
    {
            [XmlElement(ElementName = "li")]
            public List<LiXmlDto> Li { get; set; }
    }
}
