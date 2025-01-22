import React, { useEffect, useState } from 'react'
import { ControlButton } from './ControlButton'
import { useMap } from '../..';

interface MapPosition {
  center: [number, number];
  zoom: number;
  pitch: number;
  bearing: number;
}

export function HomeControl({ initialPosition }: { initialPosition: MapPosition | null }) {
  const [position, setPosition] = useState<MapPosition | null>(null)
  const { current: map } = useMap();

  const handleClick = () => {
    if (position) {
      map.flyTo({
        ...position,
        duration: 2000,
        essential: true,
      });
    }
  }

  useEffect(() => {
    if (initialPosition) {
      setPosition(initialPosition)
    }
  }, [initialPosition]);

  return (
    <ControlButton onClick={handleClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
        <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 14 L 14 14 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z" />
      </svg>
    </ControlButton >
  )
}
