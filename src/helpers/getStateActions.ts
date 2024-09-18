type Func = (...args: unknown[]) => void;

export const getStateActions = (
  state: Record<string, unknown>
): Record<string, Func> => {
  const keys = Object.keys(state as object).filter(
    (k) => typeof state[k] === "function"
  );

  return keys.reduce((obj, key) => {
    return {
      ...obj,
      [key]: state[key],
    };
  }, {});
};
