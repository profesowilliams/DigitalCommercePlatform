  /**
   * By default ag grid is listening to keypress events on edit mode
   * having conflicts with textfield editions to freely use arrows
   */
export const suppressNavigation = (params) => {
    const KEY_LEFT = 'ArrowLeft';
    const KEY_UP = 'ArrowUp';
    const KEY_RIGHT = 'ArrowRight';
    const KEY_DOWN = 'ArrowDown';  
    const editingKeys = [
      KEY_LEFT,
      KEY_RIGHT,
      KEY_UP,
      KEY_DOWN
    ];    
    if (!params.editing) {
      keysToSuppress = keysToSuppress.concat(editingKeys);
    }  
    const suppress = keysToSuppress.some(function (suppressedKey) {
      return suppressedKey === key || key.toUpperCase() === suppressedKey;
    });
    return suppress;
  };