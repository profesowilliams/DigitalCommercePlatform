import React from "react";

function OrderDetailsSerialNumbers({data}) {
  return (
        <section>
            <div className="cmp-order-details-serial-numbers-modal">
                {data?.map((val, index)=> (
                    <div key={index} className="cmp-order-details-serial-numbers-modal__line">
                        {val}
                    </div>
                    )
                )}
            </div>
        </section>
  );
}
export default OrderDetailsSerialNumbers;
