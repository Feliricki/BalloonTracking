import { create_line_layer, create_scatterplot_layer } from './layer-factory';
import { SEVERE_STORM_COLOR, VOLCANO_COLOR, WILDFIRE_COLOR, generateSlightVariation, hexToRgba } from '../services/color-scheme';
import type { EonetResponse, WeatherPoint } from '../services/eonet-nasa-service';
import type { Layer } from 'deck.gl';


// creates visuals for the cyclone path 
// overlaid with point (larger -> more recent)
export function create_cyclone_layers(data: EonetResponse, visible: boolean) {

    const layers: Layer[] = [];

    const min_radius = 5;
    const max_radius = 70;

    for (const event of data.events) {

        // process line data
        const normalizedEven = event.geometry;
        // if (normalizedEven.length % 2 === 1) {
        //     normalizedEven.pop();
        // }

        const lineData: Array<[WeatherPoint, WeatherPoint]> = [];
        for (let i = 0; i < normalizedEven.length - 2; i++) {
            lineData.push([normalizedEven[i], normalizedEven[i + 1]]);
        }

        layers.push(create_line_layer({
            id: `line_${event.title}`,
            data: lineData,
            positionFormat: "XY",
            widthMinPixels: 2,
            getSourcePosition: p => p[0].coordinates as [number, number],
            getTargetPosition: p => p[1].coordinates as [number, number],
            getColor: generateSlightVariation(SEVERE_STORM_COLOR),
            visible: visible,
            pickable: false,
        }));

        const all_dates = event.geometry.map(p => Date.parse(p.date));
        const min_date = Math.min(...all_dates);
        const max_date = Math.max(...all_dates);

        layers.push(create_scatterplot_layer({
            id: `scatterplot_cyclone_${event.title}`,
            data: event.geometry,
            positionFormat: "XY",
            getPosition: p => p.coordinates as [number, number],
            getFillColor: hexToRgba(SEVERE_STORM_COLOR),
            visible: visible,
            radiusMinPixels: min_radius,
            radiusUnits: "pixels",
            getRadius: p => {
                const normalized = (Date.parse(p.date) - min_date) / (max_date - min_date);
                return min_radius + normalized * (max_radius - min_radius);
            },
            pickable: visible,
            opacity: .1
        }));
    }

    return layers;
}

export function create_volcano_layer(data: EonetResponse, visible: boolean) {
    const layers: Layer[] = [];
    for (const event of data.events) {
        layers.push(create_scatterplot_layer({
            id: `scatterplot_volcano_${event.title}`,
            data: event.geometry,
            positionFormat: "XY",
            getPosition: p => p.coordinates as [number, number],
            getFillColor: hexToRgba(VOLCANO_COLOR),
            radiusMinPixels: 5,
            visible: visible,
            pickable: visible
        }));
    }

    return layers;
}

export function create_wildfire_layer(data: EonetResponse, visible: boolean) {
    const layers: Layer[] = [];
    for (const event of data.events) {
        layers.push(create_scatterplot_layer({
            id: `scatterplot_wildfire_${event.title}`,
            data: event.geometry,
            positionFormat: "XY",
            getPosition: p => p.coordinates as [number, number],
            getFillColor: hexToRgba(WILDFIRE_COLOR),
            radiusMinPixels: 5,
            visible: visible,
            pickable: visible
        }));
    }

    return layers;
}
