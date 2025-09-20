export const WILDFIRE_COLOR = "#FF4500";
export const VOLCANO_COLOR = "#DC143C";
export const SEVERE_STORM_COLOR = "#00BFFF";
export const BALLOON_COLOR = "#8A2BE2";

export function hexToRgba(hex: string, alpha: number = 255): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b, alpha];
}

export function rgbaToHex(rgba: [number, number, number, number]): string {
    const r = rgba[0].toString(16).padStart(2, '0');
    const g = rgba[1].toString(16).padStart(2, '0');
    const b = rgba[2].toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}

export function generateSlightVariation(hex: string): [number, number, number, number] {
    const [r, g, b, a] = hexToRgba(hex);

    const offset = () => Math.floor(Math.random() * 41) - 20; // -20 to 20

    const newR = Math.max(0, Math.min(255, r + offset()));
    const newG = Math.max(0, Math.min(255, g + offset()));
    const newB = Math.max(0, Math.min(255, b + offset()));

    return [newR, newG, newB, a];
}
