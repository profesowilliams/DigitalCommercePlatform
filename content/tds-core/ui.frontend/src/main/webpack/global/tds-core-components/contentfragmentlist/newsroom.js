(() => {
    const contentFragTileELems = document.querySelectorAll('.newsroom-style .cmp-contentfragment');
    contentFragTileELems && contentFragTileELems.forEach(contentFragTileELem => {
        const imgEle = contentFragTileELem.querySelector('.cmp-contentfragment__element--articleImage .cmp-contentfragment__element-value');
        const imgPath = imgEle.innerText.trim() !== '' ? imgEle.innerText.trim() : '/content/dam/techdata/tech-data-dot-com/global/site/about-us/leadership/profile-icon.jpeg';
        const tag = document.createElement('img');
        tag.setAttribute('src', imgPath);
        tag.setAttribute('alt', 'Article Image');
        tag.classList.add('cmp-contentfragment__image');
        contentFragTileELem.prepend(tag);
    });
})();
