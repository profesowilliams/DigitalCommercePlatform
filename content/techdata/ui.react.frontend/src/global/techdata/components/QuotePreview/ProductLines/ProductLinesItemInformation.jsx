import React from "react";

function ProductLinesItemInformation({ line }) {
  return (
    <section>
       <div className="cmp-product-lines-grid__item-information">
          <a href={line.urlProductImage} className="cmp-product-lines-grid__item-information__image-link">
               <img alt="No Image" src={line.urlProductImage} />
            </a>
          </div> 
    </section>
  );
}

export default ProductLinesItemInformation;
