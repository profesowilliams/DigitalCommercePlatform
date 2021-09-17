import bp from '../../../common-utils/js/media-match';

(function(bp) {
  "use strict";
  function hideIfPrivate(navPrimaryItems=[]){
   let sessionId = localStorage.getItem('sessionId');
   if (sessionId) return;
    for (const navItem of navPrimaryItems){
      if (navItem.dataset.cmpIsprivate === "true"){
        navItem.style.pointerEvents = "none";
        navItem.style.opacity = "0.2";
        navItem.href = "";
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
      hideIfPrivate(navPrimaryItems);
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
      event.preventDefault();
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
  };

    function changeShopLoginUrlPrefix () {
        let prefixShopAuthUrl = "";
        if(window.SHOP == undefined) { // ignore if its shop
            let sessionId = localStorage.getItem('sessionId');
            var megamenu = document.getElementById("megamenu");
            if(sessionId && megamenu) {
                var megamenuAnchorsLinks = megamenu.getElementsByTagName("a");
                let prefixURLEle = document.querySelector('#ssoLoginRedirectUrl');
                for(var i = 0; i < megamenuAnchorsLinks.length; i += 1) {
                    let incomingHref = megamenuAnchorsLinks[i].href;
                    if(incomingHref && (incomingHref.indexOf('shop.cstenet.com') != -1 || incomingHref.indexOf('shop.techdata.com') != -1 || incomingHref.indexOf('pilot.techdata.com') != -1)) {
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
