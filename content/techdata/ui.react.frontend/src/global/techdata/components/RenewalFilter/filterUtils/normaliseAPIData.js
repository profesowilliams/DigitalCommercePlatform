const findChildIds = (arr, norm) => {
  return arr.map((item) => {
    return norm.find((x) => x.title === item.name).id;
  });
};

const findObjByTitle = (label, norm) => {
  return norm.find((x) => x.title === label);
};

const normaliseAPIData = (data) => {
  let s = [];
  let temp = 0;

  /**
   * Hardcoding "ProgramName" so as to not break previous implementation.
   * There'll be a follow up PR to change this logic once things get stable.
   */
  data.forEach((item) => {
    s[(temp += 1)] = {
      title: item.name,
      id: temp,
      field: item?.searchKey ? item.searchKey : "ProgramName",
      open: false,
      checked: false,
    };

    // loop through next label
    if ("options" in item && item.options !== null) {
      item.options.forEach((option) => {
        s[(temp += 1)] = {
          title: option.text,
          id: temp,
          field: item?.searchKey ? item.searchKey : "ProgramName",
          open: false,
          checked: option.selected ? true : false,
        };

        if ("subOptions" in option && option.subOptions !== null) {
          option.subOptions.forEach((subOption) => {
            s[(temp += 1)] = {
              title: subOption.text,
              id: temp,
              field: item?.searchKey ? item.searchKey : "ProgramName",
              open: false,
              checked: subOption.selected ? true : false,
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
    if (!item.options) return;

    const j = findObjByTitle(item.name, s);
    s[j.id]["childIds"] = item?.options.map((val) => {
      return s.find((x) => x.title === val.text).id;
    });

    // loop through next label
    item?.options.forEach((subItem) => {
      if (!subItem.subOptions) return;

      const j = findObjByTitle(subItem?.text, s);
      s[j.id]["childIds"] = subItem?.subOptions.map((val) => {
        return s.find((x) => x.title === val.text).id;
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

  /**
   * append date related info to not break Date functionality.
   * after append, also add the id to the rootID's child array to make
   * it part of rootIDs.
   * TODO: To be moved elsewhere, closer to Date logic.
   */
  s.push({
    checked: false,
    childIds: [],
    field: "date",
    id: (temp += 1),
    open: false,
    title: "Date",
  });

  s[0].childIds.push(temp);

  return s;
};

export default normaliseAPIData;
