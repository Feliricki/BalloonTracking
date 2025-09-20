import {  MapboxOverlay, type MapboxOverlayProps } from '@deck.gl/mapbox';
import { useControl } from 'react-map-gl/mapbox';

function DeckGLOverlay(props: MapboxOverlayProps) {
    const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
    overlay.setProps(props);
    return null;
}

export default DeckGLOverlay;
