/* eslint-disable no-undef */
/* eslint-disable complexity */
import { useContext,  useRef, useState } from 'react';
import { ControlButtonChildContainer } from './ControlContainer';
import React from 'react';
import { ControlContext } from './ControlContext';

const setStyle = (active: boolean, isHovered: boolean, customStyle: any) => ({
  display: 'flex',
  height: '30px',
  width: '30px',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  borderRadius: '5px',
  color: active ? '#fff' : 'black',
  fill: active ? '#fff' : 'black',
  border: `1px solid ${active ? '#fff' : '#dbdbdb'}`,
  boxShadow: '0 0 0 3px rgba(0, 0, 0, .1)',
  backgroundColor: active && isHovered ? '#0c9ed9' :
    !active && isHovered ? '#dbdbdb' :
      active && !isHovered ? '#0c9ed9' : '',
  ...customStyle
})

export interface ControlButtonProps {
    children?: JSX.Element | JSX.Element[] | string;
    popup?: JSX.Element;
    onClick?: (e: unknown | React.MouseEventHandler<HTMLButtonElement>) => void;
    style?: React.CSSProperties | undefined;
    keepPopupOpen?: boolean;
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export const ControlButton = ({ children, popup, onClick, style = {}, keepPopupOpen = false }: ControlButtonProps) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const { activeIndex, setActiveIndex, orientation, position } = useContext(ControlContext);
  const [isHovered, setIsHovered] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [buttonId, setButtonId] = useState(generateUUID());

  const handleClick = (e: any) => {
    if (onClick) {
      onClick(e)
    }

    if (popup) {
      if (activeIndex === buttonId) {
        setActiveIndex('');
      }
      else {
        setActiveIndex(buttonId)
      }
    }
  };

  const closePopup = () => {
    setActiveIndex('');
  }

  const activeButton = activeIndex === buttonId;

  const transform = () => {
    return position.includes('bottom') && orientation === 'horizontal' ? 'rotate(180deg)' :
      position.includes('top') && orientation === 'horizontal' ? 'rotate(0deg)' :
        position.includes('right') && orientation === 'vertical' ? 'rotate(90deg)' :
          position.includes('left') && orientation === 'vertical' ? 'rotate(-90deg)' : ''
  }

  const arrowStylePosition = {
    transform: transform(),
    top: position?.includes('top') ? orientation === 'horizontal' ? 27 : 10 : undefined,
    bottom: position?.includes('bottom') ? orientation === 'horizontal' ? 28 : 8 : undefined,
    left: position?.includes('left') ? orientation === 'vertical' ? 21 : 2 : undefined,
    right: position?.includes('right') ? orientation === 'vertical' ? 21 : 2 : undefined,
    animation: 'popupOpacity 0.3s ease-out forwards'
  };

  return <>
    <button
      ref={ref}
      style={setStyle(Boolean(activeIndex === buttonId), isHovered, style)}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {popup && activeButton && <div className="control-container--arrow" style={arrowStylePosition} />}
    </button >
    {popup && activeButton && ref.current && <ControlButtonChildContainer keepPopupOpen={keepPopupOpen} closePopup={closePopup} refProp={ref}>{popup}</ControlButtonChildContainer>}
  </>
}