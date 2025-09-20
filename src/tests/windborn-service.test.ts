
import { describe, it, expect } from 'vitest';
import get_ballon_location from '../services/windborn-service';

describe('Windborn Service', () => {
    it('Should retrieve the balloon location data from the API', async () => {
        const locations = await get_ballon_location(1);
        expect(Array.isArray(locations)).toBe(true);
        console.log(locations)
        // The API may return an empty array if no flights are found for the given aircraft and time range
    }, 10000); // Increase timeout for this test
});
