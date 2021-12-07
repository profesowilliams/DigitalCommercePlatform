const findChildIds = (arr, norm) => {
  return arr.map((item) => {
    return norm.find((x) => x.title === item.accordionLabel).id;
  });
};

const findObjByTitle = (label, norm) => {
  return norm.find((x) => x.title === label);
};

const normaliseState = (data) => {
  let s = [];
  let temp = 0;

  data.forEach((item) => {
    s[(temp += 1)] = {
      title: item.accordionLabel,
      id: temp,
      open: false,
      checked: false,
    };

    // loop through next label
    if ("filterOptionsValues" in item) {
      item.filterOptionsValues.forEach((subItem) => {
        s[(temp += 1)] = {
          title: subItem.filterOptionLabel,
          id: temp,
          open: false,
          checked: false,
        };

        if ("subFilterOptionsValues" in subItem) {
          subItem.subFilterOptionsValues.forEach((finalItem) => {
            s[(temp += 1)] = {
              title: finalItem.subFilterOptionsLabel,
              id: temp,
              open: false,
              checked: false,
            };
          });
        }
      });
    }
  });

  s[0] = {
    title: "(root)",
    id: 0,
    childIds: [],
  };

  // insert root state
  s[0]["childIds"] = findChildIds(data, s);

  data.forEach((item) => {
    if (!item.filterOptionsValues) return;

    const j = findObjByTitle(item.accordionLabel, s);
    s[j.id]["childIds"] = item?.filterOptionsValues.map((val) => {
      return s.find((x) => x.title === val.filterOptionLabel).id;
    });

    // loop through next label
    item?.filterOptionsValues.forEach((subItem) => {
      if (!subItem.subFilterOptionsValues) return;

      const j = findObjByTitle(subItem?.filterOptionLabel, s);
      s[j.id]["childIds"] = subItem?.subFilterOptionsValues.map((val) => {
        return s.find((x) => x.title === val.subFilterOptionsLabel).id;
      });
    });
  });

  s.forEach((item, index) => {
    if (!("childIds" in item)) {
      s[index]["childIds"] = [];
    }

    if (item.childIds.length > 0 && index !== 0) {
      item.childIds.forEach((id) => {
        s[id]["parentId"] = s[index].id;
      });
    }
  });

  return s;
};

export default normaliseState;
