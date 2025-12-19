export const isFunction = <T>(a: T) => a && {}.toString.call(a) === "[object Function]";

export const isObject = <T>(a: T) => typeof a === "object" && a !== null;

export const objectHasProp = <T>(a: T, k: string) =>
  isObject(a) && Object.prototype.hasOwnProperty.call(a, k);
