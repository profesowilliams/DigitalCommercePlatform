(() => {
    const contentFragTileELems = document.querySelectorAll('.contentFragment-bio');
    contentFragTileELems && contentFragTileELems.forEach(contentFragTileELem => {
        const imgContanerEle = contentFragTileELem.querySelector('.cmp-contentfragment__element--photo');
        const imgEle = contentFragTileELem.querySelector('.cmp-contentfragment__element--photo .cmp-contentfragment__element-value');
        const imgPath = imgEle.innerText.trim() !== '' ? imgEle.innerText.trim() : '/content/dam/techdata/tech-data-dot-com/global/site/about-us/leadership/profile-icon.jpeg';
        const tag = document.createElement('img');
        tag.setAttribute('src', imgPath);
        tag.setAttribute('alt', '');
        imgContanerEle.append(tag);
    });
})();
