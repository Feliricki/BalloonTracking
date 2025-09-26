import { create_arc_layer, create_line_layer, create_scatterplot_layer } from './layer-factory';
import { SEVERE_STORM_COLOR, VOLCANO_COLOR, WILDFIRE_COLOR, generateSlightVariation, hexToRgba } from '../services/color-scheme';
import type { EonetResponse, WeatherPoint } from '../services/eonet-nasa-service';
import type { Layer, ScatterplotLayer, LineLayer, ArcLayer } from 'deck.gl';


// creates visuals for the cyclone path 
// overlaid with point (larger -> more recent)
export function create_cyclone_points(data: EonetResponse, visible: boolean) {
    const layers: ScatterplotLayer<WeatherPoint>[] = [];
    const min_radius = 1000; // 50km
    const max_radius = 500_000; // 5,000km 

    for (const event of data.events) {

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
            radiusUnits: 'meters',
            getRadius: p => {
                const normalized = (Date.parse(p.date) - min_date) / (max_date - min_date);
                return min_radius + normalized * (max_radius - min_radius);
            },
            pickable: visible,
            radiusMinPixels: 2,
            radiusMaxPixels: 100,
            opacity: 0.1
        }));

    }

    return layers;
}

export function create_cyclone_path_layer(data: EonetResponse, visible: boolean, pathType: "line" | "arc" = "line") {
    // Either an array of LineLayer, or ArcLayer (Each entry is a WeatherPoint tuple denoting the start and end point)
    const layers: (LineLayer<[WeatherPoint, WeatherPoint]> | ArcLayer<[WeatherPoint, WeatherPoint]>)[] = [];

    for (const event of data.events) {
        // process into tuple [start_point, end_point]
        const normalizedEven = event.geometry;

        const lineData: Array<[WeatherPoint, WeatherPoint]> = [];
        for (let i = 0; i < normalizedEven.length - 2; i++) {
            lineData.push([normalizedEven[i], normalizedEven[i + 1]]);
        }

        if (pathType == "line") {
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
        } else {
            layers.push(create_arc_layer({
                id: `arc_${event.title}`,
                data: lineData,
                positionFormat: "XY",
                widthMinPixels: 2,
                getSourcePosition: p => p[0].coordinates as [number, number],
                getTargetPosition: p => p[1].coordinates as [number, number],
                getSourceColor: hexToRgba(SEVERE_STORM_COLOR),
                getTargetColor: generateSlightVariation(SEVERE_STORM_COLOR),
                visible: visible,
                pickable: false
            }));
        }

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
