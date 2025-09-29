import type { WeatherPoint } from "../services/eonet-nasa-service";


export interface NearestPointRequest {
    type: "getNearestPoint";
    balloon: [number, number, number];
    balloonHoursAgo: number;
    events: WeatherPoint[];
}

interface NearestPointResponse {
    type: "nearestPoint";
    point: { lat: number, lon: number };
}

function euclideanDistance(balloon: number[], weatherCoordinate: number[]): number {
    return Math.sqrt((balloon[0] - weatherCoordinate[1]) ** 2 + (balloon[1] - weatherCoordinate[0]) ** 2);
}

function calculateNearestPoint(request: NearestPointRequest) {

    const events = request.events;
    console.log(events);
    const currentBalloon = request.balloon;

    let minDistance = Number.MAX_SAFE_INTEGER;
    let nearestPoint: { lat: number, lon: number } = { lat: 0, lon: 0 };
    for (const event of events) {
        const distance = euclideanDistance(currentBalloon, event.coordinates);
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
