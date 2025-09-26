import { ArcLayer, LineLayer, ScatterplotLayer, type ArcLayerProps, type LineLayerProps, type ScatterplotLayerProps } from "deck.gl";

// type LayerType = "LineLayer" | "PathLayer" | "ScatterplotLayer";

export function create_scatterplot_layer<T>(props: ScatterplotLayerProps<T>){
    return new ScatterplotLayer<T>(props);
}

export function create_line_layer<T>(props: LineLayerProps<T>){
    return new LineLayer<T>(props);
}

export function create_arc_layer<T>(props: ArcLayerProps<T>){
    return new ArcLayer<T>(props);
}
