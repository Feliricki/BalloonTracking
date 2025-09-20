import type { WeatherPoint } from "../services/eonet-nasa-service";


export interface NearestPointRequest {
    type: "getNearestPoint";
    ballon: [number, number, number];
    events: WeatherPoint[];
}

interface NearestPointResponse {
    type: "nearestPoint";
    point: { lat: number, lon: number };
}

function calculateNearestPoint(request: NearestPointRequest) {

    const currentBalloon = request.ballon;
    const events = request.events;

    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearestPoint: { lat: number, lon: number } = { lat: 0, lon: 0 };
    for (const event of events) {
        const distance = Math.sqrt((currentBalloon[0] - event.coordinates[1]) ** 2 + (currentBalloon[1] - event.coordinates[0]) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            nearestPoint = {
                lat: event.coordinates[1],
                lon: event.coordinates[0]
            }
        }
    }

    return nearestPoint;
}

self.onmessage = (event) => {

    switch (event.data.type) {
        // received request to calculate the nearest point to a balloon
        case "getNearestPoint":
            postMessage({
                type: "nearestPoint",
                point: calculateNearestPoint(event.data as NearestPointRequest)
            } as NearestPointResponse)
            break;
    }
};
