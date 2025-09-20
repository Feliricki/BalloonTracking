
import { describe, it, expect } from 'vitest';
import { get_forcast_at_location } from '../services/open-meteo-service';

describe('Open Meteo Service', () => {
  it('getWeather should fetch and return weather data from the API', async () => {
    // Using a fixed coordinate for testing
    const lat = 52.52;
    const lon = 13.41;
    const weather = await get_forcast_at_location(lat, lon);

    console.log(weather);
    expect(weather).toHaveProperty('hourly_units');
    expect(weather).toHaveProperty('latitude');
    expect(weather).toHaveProperty('longitude');
  });
});
