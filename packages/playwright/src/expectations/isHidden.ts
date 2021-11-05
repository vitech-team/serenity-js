import {ElementHandleExpectation} from "./ElementHandleExpectation";

const isHiddenFunction = (actual): PromiseLike<boolean> => {
    return Promise.resolve(actual == undefined || !actual.isExisting());
};

export const isHidden = (): ElementHandleExpectation => {
    return ElementHandleExpectation.forElementToBe('hidden', isHiddenFunction);
};
