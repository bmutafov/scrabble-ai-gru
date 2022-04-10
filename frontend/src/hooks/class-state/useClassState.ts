import React, { useMemo } from "react";
import { useRef, useState } from "react";
import { ClassState } from "./class-state";

const useForceUpdate = () => {
  const [, setState] = useState<number>(0);

  const forceUpdate = React.useCallback(() => {
    setState((prev) => prev + 1);
  }, []);

  return forceUpdate;
};

/* new T() */
export type Newable<T> = { new (...args: any[]): T };

export const useClassState = <U, T extends ClassState<U>>(DefinedClassState: Newable<T>) => {
  const forceUpdate = useForceUpdate();
  const classInstance = useMemo(() => new DefinedClassState()["init"](forceUpdate), [DefinedClassState, forceUpdate]);
  const stateController = useRef<T>(classInstance);

  return stateController.current;
};
