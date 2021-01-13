async function getDataFromCartApi(cartId) {
  let result = null;
  try {
    result = await $.ajax({
      type: 'GET',
      data: {
        'cartId': cartId
      },
      url: '/bin/api/cart'
    });
  } catch (error) {
    result = error;
  }
  return result;
}

async function postDataToCartApi(data) {
  let result = null;
  try {
    result = await $.ajax({
      type: 'POST',
      url: '/bin/api/cart',
      data: data,
    });
  } catch (error) {
    result = error;
  }
  return result;
}

document.addEventListener("DOMContentLoaded", function () {
  let elements = document.getElementsByClassName("cart-data");
  //cycle through all instances of component
  [].forEach.call(elements, (element) => {
    // initial values
    let componentId = "#" + element.dataset.componentId;
    let cartId = JSON.parse(element.dataset.cartData).cartId;
    const app = Vue.createApp({
      data: () => ({
        numberOfItems: JSON.parse(element.dataset.cartData).numberOfItems,
        subtotal: JSON.parse(element.dataset.cartData).subtotal,
      }),
      methods: {
        checkoutCart() {
          postDataToCartApi({ cartId: cartId, action: 'checkout' })
            .then((result) => { console.log(result) }, (reason) => { })
        },
        convertCartToQuote() {
          postDataToCartApi({ cartId: cartId, action: 'convertToQuote' })
            .then((result) => { console.log(result) }, (reason) => { })
        },
        saveCart() {
          postDataToCartApi({ cartId: cartId, action: 'save' })
            .then((result) => { console.log(result) }, (reason) => { })
        },
        changeCart() {
          console.log('changeCart');
          dispatcher.dispatch("updateCart");
        },
      },
      created() {
        let that = this;
        function mapResponseToModel(json) {
          that.$data.numberOfItems = json.numberOfItems;
          that.$data.subtotal = { value: json.subtotal.value, currency: json.subtotal.currency };
          dispatcher.state.saveState("cart", { items: that.$data.numberOfItems, subtotal: that.$data.subtotal.value });
        }
        dispatcher.on('updateCart', function () {
          getDataFromCartApi(cartId).then(result => {
            mapResponseToModel(result);
          }, error => { console.log(error) })
        });
      },
    });
    app.mount(componentId);
  });
});
