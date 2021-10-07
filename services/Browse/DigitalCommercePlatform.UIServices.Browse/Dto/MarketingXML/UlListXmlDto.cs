//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using System.Xml.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.MarketingXML
{
    [ExcludeFromCodeCoverage]
    [XmlRoot(ElementName = "body")]
	public class UlListXmlDto
    {
        [XmlElement(ElementName = "ul")]
        public UlXmlDto Ul { get; set; }
    }
}
