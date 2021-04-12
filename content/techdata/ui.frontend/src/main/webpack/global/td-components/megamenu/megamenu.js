(function() {
  "use strict";
  function Navigation({navigation}){
    // var that = this;
    const MenuSecondary = '.cmp-megamenu__secondary';
    const MenuTertiary = '.cmp-megamenu__tertiary';
    const MenuQuaternary = '.cmp-megamenu__quaternary';
    const itemToSelect = 'cmp-megamenu__wrapper-item';
    const ActiveWrappClass = 'cmp-megamenu__wrapper-item--active';
    const ActiveItemClass = 'cmp-megamenu__item--active';
    if( navigation ) init();

    function init(){
      const navSecondaryItems = navigation.querySelectorAll(MenuSecondary + ' li a');
      navSecondaryItems.forEach(function(item){
        item.addEventListener('mouseover',selectTertiaryItem)
        item.addEventListener('click',selectTertiaryItem)
      });
      const navTertiaryItems = navigation.querySelectorAll(MenuTertiary + ' li a');
      navTertiaryItems.forEach(function(item){
        item.addEventListener('mouseover',selectQuaternaryItem)
        item.addEventListener('click',selectQuaternaryItem)
      })
      const titlesCloseTertiary = navigation.querySelectorAll(MenuQuaternary + ' .cmp-megamenu-level-title')
      titlesCloseTertiary.forEach(function(item){
        item.addEventListener('click',closeQuaternaryMenus)
      })
    }
    function closeQuaternaryMenus(event){
      event.preventDefault();
      clearItems(MenuQuaternary, ' .' + itemToSelect, ActiveWrappClass);
    }
    function clearItems(menu, items, active){
      const clearItems = navigation.querySelectorAll(menu + items);
      clearItems.forEach(function(i){
        i.classList.remove(active);
      })
    }
    function selectQuaternaryItem(event){
      const target = event.target;
      if( target.dataset.cmpClickable !== 'true' || target.className.indexOf(ActiveItemClass) >=0  ) return; // avoid everything if there is no menu attached to this item
      event.preventDefault();
      clearItems(MenuTertiary, ' li a.' + ActiveItemClass, ActiveItemClass);
      target.classList.add(ActiveItemClass);
      const navQuaternaryItems = navigation.querySelectorAll(MenuQuaternary + ' .' + itemToSelect);
      navQuaternaryItems.forEach(function(n){
        if( n.dataset.cmpParent === target.dataset.cmpChildren ){
          n.classList.add(ActiveWrappClass);
        }else{
          n.classList.remove(ActiveWrappClass);
        }
      })
    }
    function selectTertiaryItem( event ){
      const target = event.target;
      if( target.dataset.cmpClickable !== 'true' || target.className.indexOf(ActiveItemClass) >=0 ) return; // avoid everything if there is no menu attached to this item
      event.preventDefault();
      clearItems(MenuSecondary, ' li a.' + ActiveItemClass, ActiveItemClass);
      target.classList.add(ActiveItemClass);
      const navTertiaryItems = navigation.querySelectorAll(MenuTertiary + ' .' + itemToSelect);
      navTertiaryItems.forEach(function(n){
        if( n.dataset.cmpParent === target.dataset.cmpChildren ){
          n.classList.add(ActiveWrappClass);
        }else{
          n.classList.remove(ActiveWrappClass);
          clearItems(MenuQuaternary, ' .' + itemToSelect, ActiveWrappClass);
          clearItems(MenuTertiary, ' li a.' + ActiveItemClass, ActiveItemClass);
        }
      })
    }
  };
  function onDocumentReady(){
    const navigators = document.querySelectorAll('.cmp-megamenu .cmp-navigation');
    navigators.forEach(function(navigation){
      new Navigation({navigation});
    });
  };
  document.addEventListener("DOMContentLoaded", onDocumentReady);
})();