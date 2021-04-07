
export const mapStateToProps = state => {
  const { userData, showError:authError } = state.auth
  const { quoteCreated, requested, showError } = state.quote
  return {
    quoteCreated,
    requested,
    showError,
    cart: userData.cart,
    authError,
  }
};