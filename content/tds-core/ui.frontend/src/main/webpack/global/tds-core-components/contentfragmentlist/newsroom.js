(() => {
  const contentFragTileELems = document.querySelectorAll('.newsroom-style .cmp-contentfragment');
  if (contentFragTileELems) {
    contentFragTileELems.forEach((contentFragTileELem) => {
      const contentFragTileELem1 = contentFragTileELem;
      const imgEle = contentFragTileELem1.querySelector('.cmp-contentfragment__element--articleImage .cmp-contentfragment__element-value');
      let dateEle = contentFragTileELem1.querySelector('.cmp-contentfragment__element--press-release-date .cmp-contentfragment__element-value');
      const dateValue = dateEle.innerText.trim();
      const imgPath = imgEle.innerText.trim() !== '' ? imgEle.innerText.trim() : '/content/dam/techdata/tech-data-dot-com/global/site/about-us/leadership/profile-icon.jpeg';
      const linkEle = contentFragTileELem1.querySelector('.cmp-contentfragment__element--articlePageReference .cmp-contentfragment__element-value');
      const linkPath = linkEle.innerText.trim() !== '' ? linkEle.innerText.trim() : '#';
      const tag = document.createElement('img');
      tag.setAttribute('src', imgPath);
      tag.setAttribute('alt', 'Article Image');
      tag.classList.add('cmp-contentfragment__image');
      contentFragTileELem1.prepend(tag);
      const orgHTML = contentFragTileELem1.innerHTML;
      const newHTML = `<a href="${linkPath}">${orgHTML}</a>`;
      contentFragTileELem1.innerHTML = newHTML;

      if (dateValue) {
        const dateValues = dateValue.split('-');
        const dayValue = dateValues[2].split(' ');
        const dateFormat = new Date(dateValues[0], dateValues[1], dayValue[0]);
        const month = dateFormat.toLocaleString('default', { month: 'short' });
        dateEle = contentFragTileELem1.querySelector('.cmp-contentfragment__element--press-release-date .cmp-contentfragment__element-value');
        dateEle.innerText = `${month} ${dayValue[0]}`;
      }
    });
  }
})();
