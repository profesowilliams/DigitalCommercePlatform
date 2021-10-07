//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using System.Xml.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.MarketingXML
{
    [ExcludeFromCodeCoverage]
    [XmlRoot(ElementName = "li")]
    public class LiXmlDto
    {
        [XmlElement(ElementName = "strong")]
        public string Strong { get; set; }
        [XmlText]
        public string Text { get; set; }
    }
}
