(function () {
  const CLASS_MODAL = 'cmp-popup__modal';
  const CLASS_MODAL_OPENED = 'cmp-popup__modal--open';
  const ID_SECURITY_FORM = 'securityform';
  const pageID = document.body.id;
  const COOKIE_NAME = 's_code_passed';
  const ID_SECURITY_BUTTON = 'verification-button';
  const DIGIT_NUMBER_SECURITY_CODE = 5;
  const submitButton = document.getElementById(ID_SECURITY_BUTTON);
  const securityForm = document.getElementById(ID_SECURITY_FORM);
  const inputs = securityForm?.querySelectorAll('input');
  const dataset = document.querySelector('[data-sec-code]');
  const errorDataset = document.querySelector('[data-error-code]');
  const errorIconDataset = document.querySelector('[data-error-icon]');
  const { secCode, secCodeEnabled } = dataset?.dataset
    ? dataset.dataset
    : { secCode: null, secCodeEnabled: null };
  const validationCodeEnabledFlag = secCodeEnabled || secCodeEnabled === '';
  const { errorCode } = errorDataset?.dataset
    ? errorDataset?.dataset
    : { errorCode: null };
  const { errorIcon } = errorIconDataset?.dataset
    ? errorIconDataset?.dataset
    : { errorIcon: 'fa-warning' };
  const cookieValue = getCookie(COOKIE_NAME);
  const cookieString = pageID + '#' + secCode;
  function handlerOpenSecurityCodeModal() {
    inputs.forEach((input) => {
      input.addEventListener(
        'keydown',
        function (e) {
          input.value = null;
          if (e.key == 'Backspace') {
            submitButton.disabled = true;
          }

          if (isFinite(e.key)) {
            input.value = e.key;
            handlerOnKeyDown(e);
          } else {
            input.value = null;
          }
        },
        true
      );
    });

    securityForm.addEventListener(
      'submit',
      function (e) {
        submitButton.disabled = true;
        validateSecurityCode();
        e.preventDefault();
        return false;
      },
      true
    );
  }

  function getCookie(name) {
    var cookieArr = document.cookie.split(';');
    for (var i = 0; i < cookieArr.length; i++) {
      var cookiePair = cookieArr[i].split('=');
      if (name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }

  function validatePageCookie() {
    const previousPagesCookie = cookieValue;
    let returnValue = true;
    if (previousPagesCookie) {
      const cookieArray = previousPagesCookie.split(',');
      cookieArray.forEach((cookie) => {
        if (cookie.includes(cookieString)) {
          returnValue = false;
          return false;
        }
      });
    }
    return returnValue;
  }

  function insertPageToCookies() {
    const previousPagesCookie = cookieValue;
    if (previousPagesCookie) {
      const hashArray = previousPagesCookie.split(',');
      hashArray.push(cookieString);
      document.cookie = COOKIE_NAME + '=' + hashArray.toString();
    } else {
      document.cookie = COOKIE_NAME + '=' + encodeURIComponent(cookieString);
    }
  }

  function removeLabels() {
    const form = document.querySelector('#securityform');
    const elements = [
      ...form.getElementsByClassName('cmp-form__error-container'),
    ];
    elements.forEach((element) => element.remove());
  }

  function validateSecurityCode() {
    removeLabels();
    const inputValues = [];
    inputs.forEach((i) => {
      inputValues.push(i.value);
    });
    const arrayString = inputValues.toString();
    const formatValue = arrayString.replace(/,/g, '');
    if (formatValue === secCode) {
      insertPageToCookies();
      closeModal();
    } else {
      createErrorContainer();
    }
  }

  function createErrorContainer() {
    ResetInputs();
    const errorContainer = document.createElement('div');
    const errorLabel = document.createElement('span');
    const errorIconElement = document.createElement('span');
    errorLabel.innerText = errorCode;
    errorLabel.style.color = 'red';
    errorIconElement.style.color = 'red';
    errorContainer.classList.add('cmp-form__error-container');
    errorIconElement.classList.add('cmp-form_icon');
    errorIconElement.classList.add(errorIcon);
    errorContainer.appendChild(errorIconElement);
    errorContainer.appendChild(errorLabel);
    const referenceNode = document.querySelector('.cmp-form__buttons');
    referenceNode.parentNode.insertBefore(errorContainer, referenceNode);
  }

  function ResetInputs() {
    inputs.forEach((input, index) => {
      input.value = null;
      if (index === 0) {
        input.focus();
      }
    });
  }

  function focusNextElement() {
    removeLabels();
    const focusSableElements =
      'a:not([disabled]), button:not([disabled]), input[type=text]:not([disabled]), [tabindex]:not([disabled]):not([tabindex="-1"])';
    if (document.activeElement && document.activeElement.form) {
      var focusSable = Array.prototype.filter.call(
        document.activeElement.form.querySelectorAll(focusSableElements),
        function (element) {
          return (
            element.offsetWidth > 0 ||
            element.offsetHeight > 0 ||
            element === document.activeElement
          );
        }
      );
      var index = focusSable.indexOf(document.activeElement);
      if (index == DIGIT_NUMBER_SECURITY_CODE) {
        submitButton.disabled = false;
      } else {
        submitButton.disabled = true;
      }
      focusSable[index + 1].focus();
    }
  }

  function handlerOnKeyDown(e) {
    if (e.target.nodeName === 'INPUT' && e.target.type !== 'textarea') {
      e.preventDefault();
      focusNextElement();
      return false;
    }
  }

  function openModal(modal) {
    modal.classList.add(CLASS_MODAL_OPENED);
    handlerOpenSecurityCodeModal();
  }

  function closeModal() {
    const tempModal = document.getElementsByClassName(CLASS_MODAL)[0];
    tempModal.style.display = 'none';
  }
  document.addEventListener('DOMContentLoaded', () => {
    const modals = document.getElementsByClassName(CLASS_MODAL);
    if (pageID && validationCodeEnabledFlag) {
      if (validatePageCookie()) {
        if (modals && modals.length > 0) {
          for (let element of modals) {
            modalElement = element;
            openModal(element);
          }
        }
      }
    }
  });
})();
