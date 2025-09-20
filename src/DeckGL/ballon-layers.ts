import type { ScatterplotLayer } from "deck.gl";
import { create_scatterplot_layer } from "./layer-factory";
import { BALLOON_COLOR, hexToRgba } from "../services/color-scheme";

export function create_ballon_scatterplot(
    data: { [hours_ago: number]: Array<[number, number, number]> },
    hours_ago: number,
    visible: boolean
) {
    const layers: ScatterplotLayer<[number, number, number]>[] = [];

    Object.keys(data).forEach((key, i) => {

        const location = data[Number.parseInt(key)];

        layers.push(create_scatterplot_layer({
            id: `scatterplot_balloon_${i}`,
            data: location,
            getPosition: p => [p[1], p[0], p[2]],
            positionFormat: "XYZ",
            getFillColor: hexToRgba(BALLOON_COLOR),
            radiusMinPixels: 5,
            visible: visible && hours_ago === Number.parseInt(key),
            pickable: hours_ago == Number.parseInt(key),
        }));
    });


    return layers;
}
