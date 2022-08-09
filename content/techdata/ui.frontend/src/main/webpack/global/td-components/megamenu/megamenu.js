import bp from '../../../common-utils/js/media-match';
import events from '../../../common-utils/js/events';

(function(bp) {
  "use strict";
  const isExtraReloadDisabled = () => document.body.hasAttribute("data-disable-extra-reload");
  let userIsLoggedIn = !isExtraReloadDisabled() && localStorage.getItem("sessionId") ? true : false;

  if (isExtraReloadDisabled()) {
    const listener = (isLoggedIn) => {
      userIsLoggedIn = isLoggedIn;

      changeShopLoginUrlPrefix();
      prefixAEMAuthUrlForAEMLinks();
      console.log(`meganav: loggedin1`, isLoggedIn);
    };

    events.addLoginListener(listener);
  }

  function enableIfNotPrivate(navPrimaryItems=[]){
   if (userIsLoggedIn) return;
    for (const navItem of navPrimaryItems){
      if (navItem.dataset.cmpIsprivate === "true"){
        navItem.style.display = "";
      }
    }
  }
  function Navigation({navigation}){
    // var that = this;
    var MenuPrimary = '.cmp-megamenu__primary';
    var MenuSecondary = '.cmp-megamenu__secondary';
    var MenuTertiary = '.cmp-megamenu__tertiary';
    var MenuQuaternary = '.cmp-megamenu__quaternary';
    var itemToSelect = 'cmp-megamenu__wrapper-item';
    var ActiveWrappClass = 'cmp-megamenu__wrapper-item--active';
    var ActiveItemClass = 'cmp-megamenu__item--active';
    var ActiveTabClass = 'cmp-megamenu__tab--active';
    var ActiveTabPanelClass = 'cmp-megamenu__tabpanel--active';
    var selected = '.cmp-megamenu__tabpanel.cmp-megamenu__tabpanel--active ';
    var MouseLeaveFlag = false;
    if( navigation ) init();

    function init(){
      var navPrimaryItems = navigation.querySelectorAll(MenuPrimary + ' li a');
      enableIfNotPrivate(navPrimaryItems);
      navPrimaryItems.forEach(function(item){
        item.addEventListener('mouseover',selectPrimaryItem)
        item.addEventListener('click',selectPrimaryItem)
      });
      var navSecondaryItems = navigation.querySelectorAll(MenuSecondary + ' li a');
      navSecondaryItems.forEach(function(item){
        item.addEventListener('mouseover',selectTertiaryItem)
        item.addEventListener('click',selectTertiaryItem)
      });
      var navItem = navigation.querySelectorAll('div.cmp-megamenu__tabpanel');
      navItem.forEach(function(item){
        item.addEventListener('mouseleave',navMouseLeave)
        item.addEventListener('mouseover',function(){
          MouseLeaveFlag = true;
        });
      });
      var navTertiaryItems = navigation.querySelectorAll(MenuTertiary + ' li a');
      navTertiaryItems.forEach(function(item){
        item.addEventListener('mouseover',selectQuaternaryItem)
        item.addEventListener('click',selectQuaternaryItem)
      })
      var titlesCloseTertiary = navigation.querySelectorAll(MenuQuaternary + ' .cmp-megamenu-level-title')
      titlesCloseTertiary.forEach(function(item){
        item.addEventListener('click',closeQuaternaryMenus)
      })
    }

    function selectPrimaryItem(event){
      var target = event.target;
      if( target.dataset.cmpClickable !== 'true') return; // avoid everything if there is no menu attached to this item

      if( event.type === 'click' && target.href === '' )
        event.preventDefault();
      clearItems(MenuPrimary, ' li a.' + ActiveTabClass, ActiveTabClass);
      target.classList.add(ActiveTabClass);
      var navSecondaryItems = navigation.querySelectorAll('.cmp-megamenu__tabpanel');
      navSecondaryItems.forEach(function(n){
        if( n.dataset.cmpParent === target.dataset.cmpChildren ){
          n.classList.add(ActiveTabPanelClass);
          preselectFirstSecondLevelItem(n);
        }else{
          n.classList.remove(ActiveTabPanelClass);
        }
      })

    }
    function preselectFirstSecondLevelItem(parentMenuItem) {
      var selectedSecondLevelElement = parentMenuItem.querySelector(selected + MenuSecondary + ' li a.' + ActiveItemClass);

      if(!selectedSecondLevelElement) {
        var firstSubmenuElement = parentMenuItem.querySelector(selected + MenuSecondary + ' li a');

        if (firstSubmenuElement) {
          firstSubmenuElement.classList.add(ActiveItemClass);
        }
      }
    }
    function navMouseLeave(event){
      if( !MouseLeaveFlag ) return;
      var target = event.target;
      target.classList.remove(ActiveTabPanelClass);
      clearItems(MenuPrimary, ' li a.' + ActiveTabClass, ActiveTabClass);
    }
    function closeQuaternaryMenus(event){
      event.preventDefault();
      MouseLeaveFlag = false;
      clearItems(MenuQuaternary, ' .' + itemToSelect, ActiveWrappClass);
    }
    function clearItems(menu, items, active){
      var clearItems = navigation.querySelectorAll(menu + items);
      clearItems.forEach(function(i){
        i.classList.remove(active);
      })
    }
    function selectQuaternaryItem(event){
      var target = event.target;
      clearItems(MenuTertiary, ' li a.' + ActiveItemClass, ActiveItemClass);
      clearItems(MenuQuaternary, ' .' + itemToSelect, ActiveWrappClass);
      if( target.dataset.cmpClickable !== 'true' || target.className.indexOf(ActiveItemClass) >=0  ) return; // avoid everything if there is no menu attached to this item
      target.classList.add(ActiveItemClass);
      var navQuaternaryItems = navigation.querySelectorAll(MenuQuaternary + ' .' + itemToSelect);
      navQuaternaryItems.forEach(function(n){
        if( n.dataset.cmpParent === target.dataset.cmpChildren ){
          n.classList.add(ActiveWrappClass);
        }else{
          n.classList.remove(ActiveWrappClass);
        }
      })
    }
    function selectTertiaryItem( event ){
      var target = event.target;
      if( target.dataset.cmpClickable !== 'true' || target.className.indexOf(ActiveItemClass) >=0 ) return; // avoid everything if there is no menu attached to this item
      event.preventDefault();
      MouseLeaveFlag = true;
      clearItems(selected + MenuSecondary, ' li a.' + ActiveItemClass, ActiveItemClass);
      target.classList.add(ActiveItemClass);
      var navTertiaryItems = navigation.querySelectorAll(selected+MenuTertiary + ' .' + itemToSelect);
      navTertiaryItems.forEach(function(n){
        if( n.dataset.cmpParent === target.dataset.cmpChildren ){
          n.classList.add(ActiveWrappClass);
        }else{
          n.classList.remove(ActiveWrappClass);
          clearItems(selected + MenuQuaternary, ' .' + itemToSelect, ActiveWrappClass);
          clearItems(selected + MenuTertiary, ' li a.' + ActiveItemClass, ActiveItemClass);
        }
      })
    }
  };

  function preInit() {
    const navigation = document.querySelector('#megamenu');
    if (!navigation) return;

    const MenuPrimary = '.cmp-megamenu__primary';
    const ActiveTabPanelClass = 'cmp-megamenu__tabpanel--active';
    const ActiveTabClass = 'cmp-megamenu__tab--active';

    document.addEventListener("mouseover", function(e) {
      const megaMenu = e.target.closest('.cmp-megamenu');
      if (!megaMenu) {
        clearItems(`${MenuPrimary} li a.${ActiveTabClass}`, ActiveTabClass);
        clearItems('.cmp-megamenu__tabpanel', ActiveTabPanelClass);
      }
    })

    function clearItems(el, active) {
      const clearItems = navigation?.querySelectorAll(el);
      clearItems.forEach(function(tabPanel){
        tabPanel.classList.remove(active);
      })
    }
  }

  function onDocumentReady(){
    preInit()
    var navigators = document.querySelectorAll('#megamenu');
    navigators.forEach(function(navigation) {
      var mediaQueryList = window.matchMedia("(min-width:1024px)");

      if (bp.desktop()) {
        new Navigation({navigation});
      }

      function triggerNavigationOnDesktop(mql) {
        if (mql.matches) {
          new Navigation({navigation});
        }
      }

      // triggers navigation only once when resize reach Desktop.
      mediaQueryList.addEventListener('change', triggerNavigationOnDesktop);
    });
    changeShopLoginUrlPrefix();
    prefixAEMAuthUrlForAEMLinks();
  };

  /**
  * Given SHOP authenticated user, replace all links in megamenu matching aem urls patterns.
  */
  function prefixAEMAuthUrlForAEMLinks() {
      let prefixAEMAuthUrl = "";
      if (window.SHOP && window.SHOP.authentication) {
        var megamenu = document.getElementById("shopHeaderContainer");
        if (window.SHOP.authentication.isAuthenticated() && megamenu) {
            var megamenuAnchorsLinks = megamenu.getElementsByTagName("a");
            let prefixURLEle = document.querySelector('#aemSSOLoginRedirectUrl');
            if(prefixURLEle) {
                prefixAEMAuthUrl = document.querySelector('#aemSSOLoginRedirectUrl').getAttribute('data-aemSSOLoginRedirectUrl');
                modifyAEMUrls(megamenuAnchorsLinks, prefixAEMAuthUrl);
            }
        }
      }
  }

    function modifyAEMUrls(megamenuAnchorsLinks, prefixAEMAuthUrl) {
        for(var i = 0; i < megamenuAnchorsLinks.length; i += 1) {
            let incomingHref = megamenuAnchorsLinks[i].href;
            if(incomingHref && (incomingHref.indexOf('sit.dc.tdebusiness.cloud') != -1 || incomingHref.indexOf('uat.dc.tdebusiness.cloud') != -1 || incomingHref.indexOf('stage.dc.tdebusiness.cloud') != -1 || incomingHref.indexOf('www.techdata.com') != -1) || incomingHref.indexOf('https://techdata.com') != -1) {
                let encodedUrl = encodeURIComponent(incomingHref);
                megamenuAnchorsLinks[i].href = prefixAEMAuthUrl + "|" + encodedUrl;
            }
        }
    }

    function changeShopLoginUrlPrefix () {
        let prefixShopAuthUrl = "";
        if(window.SHOP == undefined) { // ignore if its shop
            var shopHeaderContainer = document.getElementById("megamenu");
            if(userIsLoggedIn && shopHeaderContainer) {
                var megamenuAnchorsLinks = shopHeaderContainer.getElementsByTagName("a");
                let prefixURLEle = document.querySelector('#ssoLoginRedirectUrl');
                for(var i = 0; i < megamenuAnchorsLinks.length; i += 1) {
                    let incomingHref = megamenuAnchorsLinks[i].href;
                    if(incomingHref && (incomingHref.indexOf('shop-rc.cstenet.com') != -1 || incomingHref.indexOf('shop.cstenet.com') != -1 || incomingHref.indexOf('shop.techdata.com') != -1 || incomingHref.indexOf('pilot.techdata.com') != -1)) {
                        if(prefixURLEle) {
                            prefixShopAuthUrl = document.querySelector('#ssoLoginRedirectUrl').getAttribute('data-ssoLoginRedirectUrl');
                            if(incomingHref.indexOf(prefixShopAuthUrl) == -1) {
                                let encodedUrl = encodeURIComponent(incomingHref);
                                megamenuAnchorsLinks[i].href = prefixShopAuthUrl + "?returnUrl=" + encodedUrl;
                            }
                        }
                    }
                }
            }
        }
    }

  if (document.readyState !== "loading") {
    onDocumentReady();
  } else {
    document.addEventListener("DOMContentLoaded", onDocumentReady);
  }
})(bp);




// Accessibility MegaMenu

//!(function () {
//  var w = window,
//    d = w.document;

//  if (w.onfocusin === undefined) {
//    d.addEventListener("focus", addPolyfill, true);
//    d.addEventListener("blur", addPolyfill, true);
//    d.addEventListener("focusin", removePolyfill, true);
//    d.addEventListener("focusout", removePolyfill, true);
//  }

//  function addPolyfill(e) {
//    var type = e.type === "focus" ? "focusin" : "focusout";
//    var event = new CustomEvent(type, {
//      bubbles: true,
//      cancelable: false
//    });
//    event.c1Generated = true;
//    e.target.dispatchEvent(event);
//  }

//  function removePolyfill(e) {
//    if (!e.c1Generated) {
//      // focus after focusin, so chrome will the first time trigger tow times focusin
//      d.removeEventListener("focus", addPolyfill, true);
//      d.removeEventListener("blur", addPolyfill, true);
//      d.removeEventListener("focusin", removePolyfill, true);
//      d.removeEventListener("focusout", removePolyfill, true);
//    }
//    setTimeout(function () {
//      d.removeEventListener("focusin", removePolyfill, true);
//      d.removeEventListener("focusout", removePolyfill, true);
//    });
//  }
//})();

//function hasClass(el, className) {
//  if (el.classList) {
//    return el.classList.contains(className);
//  } else {
//    return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
//  }
//}

//var menuItems1 = document.querySelectorAll("#cmp-accessible-nav li.cmp-has-submenu");
//var timer1, timer2;

//Array.prototype.forEach.call(menuItems1, function (el, i) {
//  el.addEventListener("mouseover", function (event) {
//    this.className = "cmp-has-submenu open";
//    clearTimeout(timer1);
//  });
//  el.addEventListener("mouseout", function (event) {
//    timer1 = setTimeout(function (event) {
//      var opennav = document.querySelector(
//        "#cmp-accessible-nav .cmp-has-submenu.open"
//      );
//      opennav.className = "cmp-has-submenu";
//      opennav.querySelector("a").setAttribute("aria-expanded", "false");
//    }, 1000);
//  });
//  el.querySelector("a").addEventListener("click", function (event) {
//    if (this.parentNode.className == "cmp-has-submenu") {
//      this.parentNode.className = "cmp-has-submenu open";
//      this.setAttribute("aria-expanded", "true");
//    } else {
//      this.parentNode.className = "cmp-has-submenu";
//      this.setAttribute("aria-expanded", "false");
//    }
//    event.preventDefault();
//  });
//  var links = el.querySelectorAll("a");
//  Array.prototype.forEach.call(links, function (el, i) {
//    el.addEventListener("focus", function () {
//      if (timer2) {
//        clearTimeout(timer2);
//        timer2 = null;
//      }
//    });
//    el.addEventListener("blur", function (event) {
//      timer2 = setTimeout(function () {
//        var opennav = document.querySelector(
//          "#cmp-accessible-nav .cmp-has-submenu.open"
//        );
//        if (opennav) {
//          opennav.className = "cmp-has-submenu";
//          opennav.querySelector("a").setAttribute("aria-expanded", "false");
//        }
//      }, 10);
//    });
//  });
//});
