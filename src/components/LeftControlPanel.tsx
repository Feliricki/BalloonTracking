import React from 'react';
import { BALLOON_COLOR, SEVERE_STORM_COLOR, VOLCANO_COLOR } from '../services/color-scheme';

// TODO:Add an option for changing the line layer to a 3d arc layer
interface LeftControlPanelProps {
    layerVisibility: {
        balloons: boolean;
        cyclones: boolean;
        wildfires: boolean;
        volcanoes: boolean;
    };
    onLayerVisibilityChange: (layer: "cyclones" | "balloons" | "volcanoes" | "wildfires", visible: boolean) => void;
    hoursAgo: number;
    onHoursAgoChange: (hours: number) => void;
    pathLayerType: "line" | "arc";
    setPathLayerType: (layer_type: "line" | "arc") => void;
}

const LeftControlPanel: React.FC<LeftControlPanelProps> = ({ layerVisibility, onLayerVisibilityChange, hoursAgo, onHoursAgoChange, pathLayerType, setPathLayerType }) => {
    return (
        <div className="card" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1, padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <h5>Toggle Data Visibility</h5>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={layerVisibility.balloons}
                    onChange={(e) => onLayerVisibilityChange('balloons', e.target.checked)}
                />
                <label className="form-check-label">Balloons</label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={layerVisibility.cyclones}
                    onChange={(e) => onLayerVisibilityChange('cyclones', e.target.checked)}
                />
                <label className="form-check-label">Cyclones</label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    checked={layerVisibility.volcanoes}
                    onChange={(e) => onLayerVisibilityChange('volcanoes', e.target.checked)}
                />
                <label className="form-check-label">Volcanoes</label>
            </div>
            <hr />
            <h5>Filter Balloons By Hour(s) Ago</h5>
            <label>Hours Ago: {hoursAgo}</label>
            <input
                type="range"
                className="form-range"
                min="1"
                max="23"
                value={hoursAgo}
                onChange={(e) => onHoursAgoChange(Number(e.target.value))}
            />
            <hr />
            <h5>Change Hurricane Path Layer</h5>
            <label>Layer Type: {pathLayerType}</label>
            <select 
                className="form-select"
                value={pathLayerType} 
                onChange={(e) => setPathLayerType(e.target.value as "line" | "arc")}>
                <option value="line">Line Layer</option>
                <option value="arc">Arc Layer</option>
            </select>
            <hr />
            <h5>Legend</h5>
            <div>
                <span style={{ backgroundColor: BALLOON_COLOR, width: '10px', height: '10px', display: 'inline-block', marginRight: '5px' }}></span>
                <span>Balloons</span>
            </div>
            <div>
                <span style={{ backgroundColor: SEVERE_STORM_COLOR, width: '10px', height: '10px', display: 'inline-block', marginRight: '5px' }}></span>
                <span>Cyclones (line and points)</span>
            </div>
            <div>
                <span style={{ backgroundColor: VOLCANO_COLOR, width: '10px', height: '10px', display: 'inline-block', marginRight: '5px' }}></span>
                <span>Volcanoes</span>
            </div>

            <hr />
            <ul>
                <li>click on a balloon point to get the forecast at that location and time</li>
                <li>clicking a ballon will indicate the nearest weather event with a marker</li>
                <li>hold CRTL and click to rotate the map</li>
                <li>a larger radius for cyclone points means the data is more recent</li>
            </ul>

            <hr />
            <a href="https://github.com/Feliricki/BalloonTracking/tree/main" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-github"></i> View on GitHub
            </a>
        </div>
    );
};

export default LeftControlPanel;
