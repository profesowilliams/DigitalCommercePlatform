document.addEventListener("DOMContentLoaded", function () {
  let element = document.getElementById("sample");
  const app = Vue.createApp({
    data: () => ({
      cart: null,
    }),
    created() {
      let that = this;
      dispatcher.on('cart', function (data) { that.$data.cart = data });
    },
  });
  app.mount(element);
});
