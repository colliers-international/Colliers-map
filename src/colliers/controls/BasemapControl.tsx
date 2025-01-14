import { useState } from 'react'
import { ControlButton, ControlButtonProps } from './ControlButton'
import { useMap } from '../..';
import React from 'react';


export interface BasemapLayers {
  type: string;
  mapbox: string
}

export interface BasemapStyle {
  id: number;
  label: string;
  thumbnail: string;
  basemap_id: string;
  layers: BasemapLayers[];
  source: string;
}

const basemapGalleryStyles: any = {
  position: 'relative',
  width: '240px',
  padding: '10px',
  margin: 0,
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  maxHeight: '50vh',
  overflowY: 'auto',
  paddingBottom: 0,
};


const basemapCardStyles: any = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'relative',
  textDecoration: 'none',
  boxSizing: 'border-box',
  paddingBottom: 8,
  flexDirection: 'column',
  textAlign: 'center',
  width: '50%',
  minWidth: '108px',
  minHeight: '74px',
  fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
  fontSize: 12
};

const basemapImage = (selected: boolean) => ({
  border: selected ? '2px solid rgb(0, 210, 230)' : '2px solid #fff',
  borderRadius: '5px',
  filter: selected ? 'drop-shadow(rgba(0, 210, 230, 0.75) 0px 1px 2px)' : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
  height: '74px',
  width: '108px',
  marginBottom: '2px',
  backgroundColor: 'black'
})

export default function BasemapControl(props: ControlButtonProps & { basemapMetadata: BasemapStyle[] }) {
  return <ControlButton popup={<BaseMapGallery basemapMetadata={props.basemapMetadata} />} {...props}>
    <svg xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" viewBox="0 0 32 32" className="svg-icon"><path d="M0 0v14h13.99V0H0zm11.99 11.92V12H7.16c.471-.879 1.043-2.027 1.676-2.792.789 1.11 1.676 2.053 3.154 2.712zM5.951 2.336c.119.233.234.475.311.754.361 1.308.857 3.078 1.738 4.752C7.021 8.943 6.15 10.401 5.504 12H1.99V6.225c2.49-.862 3.445-2.79 3.961-3.889zM31.99 0H18v14h13.99V0zm-5.73 12c.01-.25.037-.561.084-.805.029-.761.309-1.917.752-2.108.242-.106.461-.163.644-.214.412-.111.877-.239 1.137-.714.266-.486.143-1.063-.053-1.684.088-.142.445-.284 1.166-.345v5.869h-3.73zm3.73-7.397c-.848.051-1.834.245-2.373.964-.301.402-.377.909-.215 1.429.055.173.084.294.1.376-.053.016-.111.031-.16.045a6.036 6.036 0 0 0-.846.284c-1.486.643-1.646 2.978-1.648 3.311-.033.161-.105.432-.102.989h-2.045c.096-.496.098-.65.08-.83.059-.568.252-3.403-1.559-4.344a2.35 2.35 0 0 1 .383-.109c2.705-.127 3.348-2.492 3.57-3.697.102-.549.672-.849 1.262-1.02h3.553v2.603zm2 13.397H18v14h13.99V18zm-10.084 8.633L23.599 30H19.99V20h.338l4.371 2.661-2.691 3.142a.754.754 0 0 0-.102.83zM23.234 20h6.756v4.113L23.234 20zM0 18v14h13.99V18H0zm11.715 3.108a2.161 2.161 0 0 1-1.689 1.367c-1.225.204-1.838 1.017-2.068 1.849-1.502-.482-2.896-.236-3.859.721-1.141 1.139-1.377 3.014-.57 4.562.045.086.096.253.133.393h-1.67V20h10.01v.127c-.365.515-.27.933-.285.981z" /></svg>
  </ControlButton>
}

const BaseMapGallery = ({ basemapMetadata }: { basemapMetadata: BasemapStyle[] }) => {
  const { current: map } = useMap();
  const [selectedBasemap, setSelectedBasemap] = useState(map?.getStyle());

  const splitAtLastSlash = () => {
    if (!selectedBasemap?.sprite) {
      return ''
    }
    const lastIndex = selectedBasemap.sprite.lastIndexOf('/');
    if (lastIndex === -1) {
      return [selectedBasemap.sprite];
    }

    return selectedBasemap.sprite.slice(lastIndex + 1);
  }
  const handleChange = (v: BasemapStyle) => {
    map?.getMap().setStyle(v.layers[0].mapbox);
    setSelectedBasemap({ sprite: v.layers[0].mapbox } as any);
  }

  return <ul style={{ ...basemapGalleryStyles }} >
    {basemapMetadata.map((b) => <BasemapCard key={b.label} basemap={b} selected={splitAtLastSlash() === b.basemap_id} handleChange={handleChange} />)}
  </ul>
}

function BasemapCard({
  basemap, selected, handleChange,
}: { basemap: BasemapStyle; handleChange: (b: BasemapStyle) => void; selected?: boolean; }) {
  const { thumbnail } = basemap;

  return (
    <li style={basemapCardStyles} onClick={() => handleChange(basemap)}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <img style={basemapImage(Boolean(selected))} src={thumbnail} alt="basemap thumbnail" />
        <span>{basemap.label}</span>
      </div>
    </li>
  );
}