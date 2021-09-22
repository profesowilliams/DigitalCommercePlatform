import React from "react";

function ImageLineInformation({ line }) {
  return (
    <section>
      <div className="cmp-product-lines-grid__item-information">
        <a
          href={line.urlProductSpec}
          target="_blank"          
          className="cmp-product-lines-grid__item-information__image-link text-center"
        >
          <img alt={line.urlProductImage ? '' : 'No Image'} src={line.urlProductImage} />
        </a>      
      </div>
    </section>
  );
}
export default ImageLineInformation;
