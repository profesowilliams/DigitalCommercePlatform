import produce from "immer";
import set from "lodash.set";

// Helper function that uses a setState function and calls it using immer produce.
// Uses lodash set to be able to use a path instead of manually navigating the draft object.
export const setStateWithProduce = (setStateFn, path, value) => {
    setStateFn(
        produce((draft) => {
            set(draft, path, value);
        })
    )
};

// Curried function that helps create a setStateWithProduce with always the same setStateFn
// Helps to not call all the time the function with the same first argument (see reseller use).
export const createProducedSetter = (setStateFn) => {
    return (path, value) => setStateWithProduce(setStateFn, path, value);
}