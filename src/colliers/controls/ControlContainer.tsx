/* eslint-disable no-undef */
import { useState, useMemo, useContext } from 'react';
import React from 'react';
import { ControlContext, ControlProvider } from './ControlContext';
import { useMap } from '../..';

export type controlPosition = 'top-right' | 'bottom-left' | 'bottom-right' | 'top-left'

export interface ControlContainerProps {
  position: controlPosition;
  children: any;
  orientation: 'horizontal' | 'vertical';
  keepPopupOpen?: boolean;
  closePopup?: () => void;
  style?: React.CSSProperties | undefined;
}

export function ControlContainer({ position, children, orientation, style = {} }: ControlContainerProps) {
  const [mpLogo, setMpLogo] = useState(false)
  const [mpCompact, setMapCompact] = useState(false)
  const { current: map } = useMap();

  useMemo(() => {
    map?.once('idle', () => {
      const mapboxlogo = document.getElementsByClassName('mapboxgl-ctrl-logo');
      const mapboxCompact = document.getElementsByClassName('mapboxgl-compact');
      setMpLogo(Boolean(mapboxlogo.length))
      setMapCompact(Boolean(mapboxCompact.length))
    })
  }, [map])

  const stylePosition = {
    top: position.includes('top') ? 10 : undefined,
    bottom: position.includes('bottom') ? mpCompact ? '50px' : mpLogo ? '30px' : '10px' : undefined,
    left: position.includes('left') ? 10 : undefined,
    right: position.includes('right') ? 10 : undefined,
  }

  return (
    <ControlProvider {...{ children, position, orientation, activeIndex: '', setActiveIndex: () => { } }}>
      <div style={{
        ...stylePosition,
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        position: 'absolute',
        zIndex: 15,
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        ...style
      }}>
        {React.Children.map(children, (child, index) => React.cloneElement(child, { index, position, orientation }))}
      </div >
    </ControlProvider>
  )
}

export function ControlButtonChildContainer({ children, keepPopupOpen, closePopup, refProp }: Partial<ControlContainerProps> & { refProp: React.RefObject<HTMLButtonElement>; }) {
  const { orientation, position } = useContext(ControlContext);
  const { current: map } = useMap();

  // @ts-ignore
  const { top, bottom, left, right } = refProp.current.getBoundingClientRect()
  const mapContainer = map?.getContainer().getBoundingClientRect()

  if (!mapContainer) {
    return null;
  }
  const t = top - mapContainer.top;
  const b = mapContainer.bottom - bottom;
  const l = left - mapContainer.left;
  const r = mapContainer.right - right;

  const stylePosition = {
    top: position?.includes('top') ? orientation === 'horizontal' ? 40 : -10 + t : undefined,
    bottom: position?.includes('bottom') ? orientation === 'horizontal' ? 40 : -30 + b : undefined,
    left: position?.includes('left') ? orientation === 'vertical' ? 40 : l - 10 : undefined,
    right: position?.includes('right') ? orientation === 'vertical' ? r + 30 : r - 10 : undefined,
  };

  return (
    <div
      onClick={() => !keepPopupOpen && closePopup ? closePopup() : null}
      style={{
        ...stylePosition,
        position: 'absolute',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '5px',
        animation: 'popupOpacity 0.2s ease-out forwards'
      }}>
      <div style={{
        position: 'relative',
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        borderRadius: '4px',
        boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)'
      }}>
        {React.Children.map(children, child => {
          return React.cloneElement(child, { position, orientation });
        })}
      </div>
    </div >
  )
}
