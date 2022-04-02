export const unique = <T>(...args: T[]): T[] => {
  return [...new Set(args)];
};
