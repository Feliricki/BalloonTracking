import { describe, it, expect } from 'vitest';
import { get_cyclones, get_volcanoes } from '../services/eonet-nasa-service';

describe('EONET NASA Service', () => {
  it('get_cyclones should fetch and return cyclone events from the API', async () => {
    const response = await get_cyclones();
    expect(response).toHaveProperty('events');
    expect(Array.isArray(response.events)).toBe(true);
    if (response.events.length > 0) {
      expect(response.events[0]).toHaveProperty('id');
      expect(response.events[0]).toHaveProperty('title');
    }
  });

  /* NOTE:This retrieves a lot of data and will often time out
  it('get_wildfires should fetch and return wildfire events from the API', async () => {
    const response = await get_wildfires();
    expect(response).toHaveProperty('events');
    expect(Array.isArray(response.events)).toBe(true);
    if (response.events.length > 0) {
      expect(response.events[0]).toHaveProperty('id');
      expect(response.events[0]).toHaveProperty('title');
    }
  }, 10000);
  */

  it('get_volcanoes should fetch and return volcano events from the API', async () => {
    const response = await get_volcanoes();
    expect(response).toHaveProperty('events');
    expect(Array.isArray(response.events)).toBe(true);
    if (response.events.length > 0) {
      expect(response.events[0]).toHaveProperty('id');
      expect(response.events[0]).toHaveProperty('title');
    }
  });
});
