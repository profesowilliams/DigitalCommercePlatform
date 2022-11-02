(function () {
  const CLASS_SECURITY_MODAL = 'cmp-s-code-popup__modal';
  const ID_SECURITY_FORM = 'securityform';
  const CLASS_CONTAINER = 'securitycode';
  const ID_SECURITY_BUTTON = 'verification-button';
  const submitButton = document.getElementById(ID_SECURITY_BUTTON);
  const securityForm = document.getElementById(ID_SECURITY_FORM);
  const inputs = securityForm.querySelectorAll('input');
  const containerDataset = document.getElementsByClassName(CLASS_CONTAINER);
  
  containerDataset[0].dataset
  const dataset = document.querySelector('[data-cmp-security-code]');
  const {cmpSecurityCode, cmpSecurityCodeEnabled} = dataset.dataset;
  console.log("🚀 ~ file: popup.js ~ line 76 ~ cmpSecurityCodeEnabled", cmpSecurityCodeEnabled)
  let flagSubmitCode = false;
  inputs.forEach(input =>{
    input.addEventListener('keydown', function(e) {
      input.value = null;

      if (e.key == 'Backspace') {
        submitButton.disabled = true;
      }

      if (isFinite(e.key)) {
        input.value = e.key;
        handlerOnKeyDown(e)
      } else {
        input.value = null;
      }
    }, true);
  });

  submitButton.addEventListener('click',function(e) {
    validateInput()
  }, true)

  securityForm.addEventListener('submit',function(e) {
    validateInput()
  }, true)
  
  function validateInput() {
    const inputValues = [];
    inputs.forEach(i => {
      inputValues.push(i.value);
    })
    const arrayString = inputValues.toString();
    const formatValue = arrayString.replace(/,/g, '');
    if (formatValue === cmpSecurityCode) {
      console.log(true);
    } else {
      console.log(false);
    }
  }

  function focusNextElement() {
    const focusSableElements = 'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    if (document.activeElement && document.activeElement.form) {
      var focusSable = Array.prototype.filter.call(document.activeElement.form.querySelectorAll(focusSableElements),
        function(element) {
          return element.offsetWidth > 0 || element.offsetHeight > 0 || element === document.activeElement
        });
      var index = focusSable.indexOf(document.activeElement);
      if (index == 5) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
      focusSable[index + 1].focus();
    } else {
      flagSubmitCode = true
    }
  }
  
  function handlerOnKeyDown(e) {
    if (e.target.nodeName === 'INPUT' && e.target.type !== 'textarea') {
      e.preventDefault();
      focusNextElement();
      return false;
    }
  }
})();