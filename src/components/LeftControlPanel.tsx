import React from 'react';
import { BALLOON_COLOR, SEVERE_STORM_COLOR, VOLCANO_COLOR } from '../services/color-scheme';

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
}

const LeftControlPanel: React.FC<LeftControlPanelProps> = ({ layerVisibility, onLayerVisibilityChange, hoursAgo, onHoursAgoChange }) => {
    return (
        <div className="card" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1, padding: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <h5>Toggle Layer Visibility</h5>
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
            <h5>Filter Ballons By Hour(s) Ago</h5>
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
            </ul>
        </div>
    );
};

export default LeftControlPanel;
