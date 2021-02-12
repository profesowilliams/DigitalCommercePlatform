using System;
using System.Runtime.Serialization;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    [Serializable]
    [DataContract]
    public class BasketNotesStatusDto
    {
        /// <summary>
        /// Gets or sets Notes
        /// </summary>
        [DataMember]
        public string Notes { get; set; }

        /// <summary>
        /// Gets or sets Type of Notes
        /// </summary>
        [DataMember]
        public string NoteType { get; set; }
    }
}