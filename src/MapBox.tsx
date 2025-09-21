import { Map, NavigationControl, Marker } from 'react-map-gl/mapbox';
import DeckGL from '@deck.gl/react';
import { type Layer, type PickingInfo } from 'deck.gl';
import { useState, useEffect, useRef, useMemo } from 'react';
import get_ballon_location from './services/windborn-service';
import { get_cyclones, get_volcanoes, type EonetResponse, type WeatherPoint } from './services/eonet-nasa-service';
import { create_ballon_scatterplot } from './DeckGL/ballon-layers';
import { create_cyclone_layers, create_volcano_layer } from './DeckGL/weather-events-layers';
import LeftControlPanel from './components/LeftControlPanel';
import RightForecastPanel from './components/RightForecastPanel';
import NearestNeighborWorker from './workers/nearest-neighbor.worker?worker';
import type { NearestPointRequest } from './workers/nearest-neighbor.worker';

// one hour
const CACHE_DURATION = 1000 * 60 * 60;
const DefaultLayerVisiblity = {
    balloons: true,
    cyclones: true,
    wildfires: true,
    volcanoes: true
} as const;


function MapBox() {

    // hours ago range: [1, 23]
    const [hoursAgo, setHoursAgo] = useState(1);
    const [balloonLocations, setBalloonLocations] = useState<{ [hours_ago: number]: Array<[number, number, number]> }>({});
    // currently focused ballon
    const [currentBalloon, setCurrentBallon] = useState<[number, number, number] | null>(null);

    const [cyclones, setCyclones] = useState<EonetResponse | null>(null);
    const [volcanoes, setVolcanoes] = useState<EonetResponse | null>(null);

    const [layerVisibility, setLayerVisibility] = useState(DefaultLayerVisiblity);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const workerRef = useRef<Worker | null>(null);

    // deck.gl visual layers
    const [layers, setLayers] = useState<Layer[]>([]);

    // nearest weather event (also a cache for each previously calculated result)
    // ballon -> nearest weather event 
    // `lat,lon` -> [lng, lat]
    // const [nearestPoint, setNearestPoint] = useState<{ [point: string]: { lat: number, lon: number } }>({});
    const [nearestPoint, setNearestPoint] = useState<{ lat: number, lon: number } | null>(null);

    // webworker setup for calculating nearest point to the currently focused balloon
    useEffect(() => {
        workerRef.current = new NearestNeighborWorker();
        const worker = workerRef.current;

        worker.onmessage = (event) => {
            switch (event.data.type) {
                case "nearestPoint":
                    setNearestPoint(event.data.point);
                    break;
                default:
                    break;
            }
        };

        return () => {
            workerRef.current?.terminate();
            workerRef.current = null;
        };
    }, []);


    // setup automatic cache invalidation on a hourly basis
    useEffect(() => {
        const clearAllCache = () => {
            setBalloonLocations({});
            setCurrentBallon(null);
            setLayers([]);
            setLayerVisibility(DefaultLayerVisiblity);
            setNearestPoint(null);
        };

        timerRef.current = setInterval(clearAllCache, CACHE_DURATION);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    // fetch ballons for the current hours_ago value
    useEffect(() => {
        if (!balloonLocations[hoursAgo]) {
            get_ballon_location(hoursAgo)
                .then(locations => {
                    if (locations) {
                        setBalloonLocations(prev => ({ ...prev, [hoursAgo]: locations }));
                    }
                })
                .catch(error => {
                    console.error("Error fetching balloon location: ", error);
                });
        }
    }, [hoursAgo, balloonLocations]);

    // Fetch weather events
    useEffect(() => {
        const fetchData = async () => {
            try {
                const curCyclones = await get_cyclones();
                const curVolcanoes = await get_volcanoes();

                setCyclones(curCyclones);
                setVolcanoes(curVolcanoes);

                // setWildfires(curWildfires);
            } catch (error) {
                console.error("Error fetching weather events: ", error);
            }
        }

        fetchData();
    }, []);

    // React to changes in data, and layer visibility
    useEffect(() => {
        const allLayers: Layer[] = [];

        if (balloonLocations[hoursAgo]) {
            allLayers.push(...create_ballon_scatterplot(balloonLocations, hoursAgo, layerVisibility.balloons));
        }

        if (cyclones) {
            allLayers.push(...create_cyclone_layers(cyclones, layerVisibility.cyclones));
        }

        if (volcanoes) {
            allLayers.push(...create_volcano_layer(volcanoes, layerVisibility.volcanoes));
        }

        setLayers(allLayers);
    }, [balloonLocations, cyclones, volcanoes, hoursAgo, layerVisibility]);


    const getTooltip = (pickingInfo: PickingInfo<number[] | WeatherPoint>) => {
        // This would be the actual point or triple 
        const object = pickingInfo.object;

        // hovering over balloon
        if (Array.isArray(object)) {
            return `lat: ${object[0]}, lon: ${object[1]} alt: ${object[2]}`;
        }

        // hovering over a GeoJSON Point (with weather fields)
        if (object && 'type' in object) {
            const eventDate = new Date(object.date);

            let html = `Weather Event: ${pickingInfo.layer?.props.id.split("_").at(2)}</br>`;
            if (object.magnitudeValue) {
                html += `Magnitude: ${object.magnitudeValue} ${object.magnitudeUnit}</br>`;
            }

            html += `
                Date: ${eventDate.toLocaleDateString()}</br>
                Event Time: ${eventDate.toLocaleTimeString()}</br>
                Location: Latitude: ${object.coordinates[1]} Longitude: ${object.coordinates[0]}
            `;

            return {
                html: html
            };
        }

        return null;
    }

    const handleLayerVisibilityChange = (layer: keyof typeof DefaultLayerVisiblity, visible: boolean) => {
        setLayerVisibility(prev => ({ ...prev, [layer]: visible }));
    };

    const handleClicks = ({ object }: PickingInfo<WeatherPoint | number[]>) => {
        // handle balloon clicks
        if (Array.isArray(object)) {
            setCurrentBallon(object as [number, number, number]);
            if (!cyclones || !volcanoes) {
                return;
            }
            workerRef.current?.postMessage({
                type: "getNearestPoint",
                ballon: object,
                events: [...cyclones.events.flatMap(e => e.geometry), ...volcanoes.events.flatMap(e => e.geometry)]
            } as NearestPointRequest);
        } else {
            setCurrentBallon(null);
            setNearestPoint(null);
        }
    }

    // calculate the nearest weather event to the currently focused balloon
    const getNearestWeatherEvent = useMemo(() => {
        if (!currentBalloon || !nearestPoint || !cyclones || !volcanoes) {
            return null;
        }
        for (const event of cyclones.events) {
            for (const point of event.geometry) {
                if (point.coordinates[0] === nearestPoint.lon && point.coordinates[1] === nearestPoint.lat) {
                    return {
                        title: event.title,
                        point: point
                    };
                }
            }
        }

        for (const event of volcanoes.events) {
            for (const point of event.geometry) {
                if (point.coordinates[0] === nearestPoint.lon && point.coordinates[1] === nearestPoint.lat) {
                    return {
                        title: event.title,
                        point: point
                    };
                }
            }
        }

        return null;
    }, [currentBalloon, nearestPoint, cyclones, volcanoes]);

    return <div style={{ height: "100%", width: "100%" }}>
        <LeftControlPanel
            layerVisibility={layerVisibility}
            onLayerVisibilityChange={handleLayerVisibilityChange}
            hoursAgo={hoursAgo}
            onHoursAgoChange={setHoursAgo}
        />
        <RightForecastPanel balloon={currentBalloon} onClose={() => setCurrentBallon(null)} hoursAgo={hoursAgo} nearestEvent={getNearestWeatherEvent} />
        <DeckGL
            initialViewState={{
                longitude: 30,
                latitude: 15,
                zoom: 2
            }}
            getTooltip={getTooltip}
            controller={true}
            layers={layers}
            onClick={handleClicks}
        >
            <Map
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_API}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                projection={'mercator'}
                attributionControl={true}
            >
                <NavigationControl position={"bottom-right"} />
                {nearestPoint && <Marker key={0} longitude={nearestPoint.lon} latitude={nearestPoint.lat} offset={[0, -20]} />}
            </Map>
        </DeckGL>
    </div>;
}

export default MapBox;
