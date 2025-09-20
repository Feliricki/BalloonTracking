const baseUrl = "https://eonet.gsfc.nasa.gov/api/v3/";

export type WeatherPoint = GeoJSON.Point & { magnitudeValue: number; magnitudeUnit: string; date: string; type: string } ;

export interface EonetResponse {
    title: string;
    description: string;
    link: string;
    events: Array<WeatherEvent>;
}

// Each weather event corresponds to a specific cylcone, wildfire, volcanos, etc
interface WeatherEvent {
    id: string;
    title: string;
    categories: { id: string; title: string }[];
    sources: { id: string; url: string }[];
    geometry: Array<WeatherPoint>
}


export async function get_cyclones() {
    const url = baseUrl + "events?category=severeStorms&status=open";
    const response = await fetch(url);
    return await response.json() as EonetResponse;
}

// only 35 records as of now
// each event has a single point geometry as expected
export async function get_volcanoes() {
    const url = baseUrl + "categories/volcanoes?status=open";
    const response = await fetch(url);
    return await response.json() as EonetResponse;
}

// around 5,000 records
// each event has only a single point geometry
export async function get_wildfires() {
    const url = baseUrl + "categories/wildfires?status=open";
    const response = await fetch(url);
    return await response.json() as EonetResponse;
}

