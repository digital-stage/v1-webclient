import React, { useEffect, useState } from 'react';
import TextField from '../base/TextField';
import { useStage } from '../stage/useStage';


const AdvancedSettings = () => {
    const { advancedSettings,valueLength,handleAdvancedSettingsChange } = useStage()

    useEffect(() => {
    }, [])

    return (
        <div>
            Advanced settings
            {/* <TextField
                label="Width"
                maxLength={4}
                name="width"
                onChange={handleAdvancedSettingsChange}
                value={advancedSettings && advancedSettings.width}
                valueLength={valueLength && valueLength.width}
                type="number"
            />
             <TextField
                label="Length"
                maxLength={4}
                name="length"
                onChange={handleAdvancedSettingsChange}
                value={advancedSettings && advancedSettings.length}
                valueLength={valueLength && valueLength.length}
                type="number"
            />
             <TextField
                label="Height"
                maxLength={4}
                name="height"
                onChange={handleAdvancedSettingsChange}
                value={advancedSettings && advancedSettings.height}
                valueLength={valueLength && valueLength.height}
                type="number"
            />
             <TextField
                label="Absorption"
                maxLength={4}
                name="absorption"
                onChange={handleAdvancedSettingsChange}
                value={advancedSettings && advancedSettings.absorption}
                valueLength={valueLength && valueLength.absorption}
                type="number"
            />
             <TextField
                label="Damping"
                maxLength={4}
                name="damping"
                onChange={handleAdvancedSettingsChange}
                value={advancedSettings && advancedSettings.damping}
                valueLength={valueLength && valueLength.damping}
                type="number"
            /> */}
        </div>
    )
}

export default AdvancedSettings