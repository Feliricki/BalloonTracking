export interface MeteoForecast {
    latitude: number;
    longitude: number;
    elevation: number;
    hourly_units: {
        time: string;
        temperature_2m: string;
        relative_humidity_2m: string;
        wind_speed_10m: string;
        precipitation: string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity: number[];
        wind_speed_10m: number[];
        precipitation: number[];
    }
}

export async function get_forcast_at_location(latitude: number, longitude: number) {
    const url = "https://api.open-meteo.com/v1/forecast?"
        + `latitude=${latitude}&longitude=${longitude}`
        + "&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&past_days=1";

    const response = await fetch(url);
    return await response.json() as MeteoForecast;
}
