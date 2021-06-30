import bp from '../../../common-utils/js/media-match';
import { hasSomeParentTheClass } from '../../../common-utils/js/helper';

(function(bp) {

  "use strict";
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

      headerResize();
      window.addEventListener('resize', headerResize);

      var searchEl = document.querySelector('.cmp-experiencefragment--header .search');
      if (searchEl) {
        searchEl.addEventListener('click', () => toggleSearch(searchEl));
        document.addEventListener('click', (event) => showSearchIconOnly(event, searchEl));
      }

      initSecondaryImage();

    }

    function headerResize() {
      const headerEl = (() => {
        let el = document.querySelector('.cmp-experiencefragment--header')
        if (el) return el;
      })();

      if (bp.tablet()) {
        headerEl.classList.add('cmp-experiencefragment--header-mobile');
      } else {
        headerEl.classList.remove('cmp-experiencefragment--header-mobile');
      }
    }

    function toggleSearch(el) {
      if (hasSomeParentTheClass(el, 'cmp-experiencefragment--header-mobile')) {
        el.classList.add('active');
        document.querySelector('.cmp-header--logo-small').classList.add('active');
        document.querySelector('.dp-figure').style.display = 'none';
      }
    }

    function showSearchIconOnly(event, el) {
      if (hasSomeParentTheClass(el, 'cmp-experiencefragment--header-mobile')) {
          if (!el.contains(event.target)) {
            el.classList.remove('active');
            document.querySelector('.cmp-header--logo-small').classList.remove('active');
            document.querySelector('.dp-figure').style.display = 'block';
          }
      }
    }

    function initSecondaryImage() {
      var imgEl = document.querySelectorAll('[data-mobileLogo]')[0];
      if (imgEl) {
        var smallLogo = imgEl.dataset.mobilelogo;
        var smallImgEl = document.querySelector('.cmp-header--logo-small');
        smallImgEl.src = smallLogo;
      }
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

        firstSubmenuElement.classList.add(ActiveItemClass);
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
      if( target.dataset.cmpClickable !== 'true' || target.className.indexOf(ActiveItemClass) >=0  ) return; // avoid everything if there is no menu attached to this item
      event.preventDefault();
      clearItems(MenuTertiary, ' li a.' + ActiveItemClass, ActiveItemClass);
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
  function onDocumentReady(){
    var navigators = document.querySelectorAll('#megamenu');
    navigators.forEach(function(navigation){
      new Navigation({navigation});
    });
  };
  document.addEventListener("DOMContentLoaded", onDocumentReady);
})(bp);
