/* eslint-disable no-undef */
import React,{ createContext, useMemo, useState } from 'react'

export interface ControlContextProps {
    activeIndex: string;
    setActiveIndex: (index: string) => void;
    orientation: 'horizontal' | 'vertical';
    position: 'top-right' | 'bottom-left' | 'bottom-right' | 'top-left';
    children?: JSX.Element | JSX.Element[];
}

export const ControlContext = createContext({ orientation: 'horizontal', position: 'top-left', activeIndex: '' } as ControlContextProps)

export function ControlProvider(props: ControlContextProps) {
  const [activeIndex, setActiveIndex] = useState<string>('')

  const memoizedValue = useMemo(() => ({
    ...props,
    activeIndex,
    setActiveIndex
  }), [activeIndex]);

  return (
    <ControlContext.Provider value={memoizedValue} >
      {props.children}
    </ControlContext.Provider>
  );

}