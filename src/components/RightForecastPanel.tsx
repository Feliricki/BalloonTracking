
import React, { useEffect, useRef, useState } from 'react';
import { get_forcast_at_location, type MeteoForecast } from '../services/open-meteo-service';
import type { WeatherPoint } from '../services/eonet-nasa-service';

const CACHE_DURATION = 1000 * 60 * 60;

interface RightForecastPanelProps {
    balloon: [number, number, number] | null;
    onClose: () => void;
    hoursAgo: number;
    nearestEvent: { title: string, point: WeatherPoint } | null;
}


function hoursAgoToIndex(hours_ago: number, cureForecast: MeteoForecast | null): number {
    if (!cureForecast) return 0;
    // binary search could speed this up
    const curDate = new Date();
    curDate.setHours(curDate.getHours() - hours_ago);

    for (let i = 0; i < cureForecast.hourly.time.length - 1; i++) {
        const prevForecast = new Date(cureForecast.hourly.time[i]);
        const nextForecast = new Date(cureForecast.hourly.time[i + 1]);
        if (curDate > prevForecast && curDate < nextForecast) {
            return i;
        }
    }

    return 0;
}



const RightForecastPanel: React.FC<RightForecastPanelProps> = ({ balloon, onClose, hoursAgo, nearestEvent }) => {
    const [forecast, setForecast] = useState<MeteoForecast | null>(null);
    const [loading, setLoading] = useState(false);
    const hoursAgoIndex = hoursAgoToIndex(hoursAgo, forecast);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const invalidateCache = () => {
            setForecast(null);
        }
        timerRef.current = setInterval(invalidateCache, CACHE_DURATION);
        return () => clearInterval(timerRef.current ?? undefined);
    }, [])

    useEffect(() => {
        if (balloon) {
            setLoading(true);
            get_forcast_at_location(balloon[0], balloon[1])
                .then(data => {
                    setForecast(data);
                })
                .catch(error => {
                    console.error("Error fetching forecast: ", error);
                })
                .finally(() => setLoading(false));
        }
    }, [balloon, hoursAgo]);

    if (!balloon) {
        return null;
    }
    return (
        <div className="card" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', minWidth: "250px" }}>
            <div className="d-flex justify-content-between">
                <h5>Weather Forecast</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : forecast ? (
                <div>
                    <h6>Forecast at {balloon[0].toFixed(2)}, {balloon[1].toFixed(2)}</h6>
                    <p><b>Forecast For:</b> {new Date(forecast.hourly.time[hoursAgoIndex]).toLocaleDateString()} at {new Date(forecast.hourly.time[hoursAgoIndex]).toLocaleTimeString()}</p>
                    <p><b>Temperature:</b> {forecast.hourly.temperature_2m[hoursAgoIndex]}°C</p>
                    <p><b>Wind Speed:</b> {forecast.hourly.wind_speed_10m[hoursAgoIndex]} km/h</p>
                    <p><b>Precipitation:</b> {forecast.hourly.precipitation[hoursAgoIndex]} mm</p>
                    {nearestEvent && <p>
                        <b>Nearest Weather Event:</b> "{nearestEvent.title}" at longitude: {nearestEvent.point.coordinates[0]} latitude: {nearestEvent.point.coordinates[1]}
                    </p>}
                </div>
            ) : (
                <p>No forecast data available.</p>
            )}
        </div>
    );
};

export default RightForecastPanel;
