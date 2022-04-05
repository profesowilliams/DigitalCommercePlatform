//2022 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Helpers
{
    public static class ImageHelper
    {
        public const string ImageDefaultResolution = "default";
        public static bool TryGetDefaultImage(IDictionary<string, IEnumerable<ImageDto>> images, out ImageDto outImage)
        {
            outImage = null;
            
            if (images == null) 
            {
                return false;
            }

            if (images.Count == 1 && images.ContainsKey(ImageDefaultResolution))
            {
                outImage = images[ImageDefaultResolution].First();
                return true;
            }

            return false;
        }
    }
}
