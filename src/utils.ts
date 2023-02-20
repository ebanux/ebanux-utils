// eslint-disable-next-line import/prefer-default-export

export const isObject = (obj: any): boolean => Object.prototype.toString.call(obj).indexOf('Object') !== -1;

export const isEmpty = (v: any): boolean => (v === ''
  || v === null
  || v === undefined
  || (isObject(v) && Object.keys(v).length === 0)
  || (Array.isArray(v) && v.length === 0)
);

export const reduceEmptyAttrs = (obj: any, replaceWithNull: boolean = false) => {
  const newObj: any = {};

  Object.entries(obj).forEach(([k, pV]) => {
    let nV: any = pV;

    if (isObject(pV)) {
      nV = reduceEmptyAttrs(pV, false);
      if (replaceWithNull && !isEmpty(nV)) nV = reduceEmptyAttrs(pV, true);
    }

    if (!isEmpty(nV)) {
      newObj[k] = nV;
    } else if (nV !== undefined && replaceWithNull) {
      newObj[k] = null;
    }
  });

  return newObj;
};

export const isBrowser = (): boolean => typeof window !== 'undefined';

export const iFrameDetected: boolean = (() => {
  if (!isBrowser()) return false;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('embedded') || (window !== window.parent);
})();