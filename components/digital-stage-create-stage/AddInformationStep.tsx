import React, { useEffect, useState } from 'react';
import { Stage } from '../../lib/digitalstage/common/model.server';
import TextField from '../base/TextField';
import { useStage } from '../stage/useStage';


const AddInformatinStep = () => {
    const { info, valueLength, error, handleInfoChange } = useStage()
    const [nameError, setNameError] = useState<boolean>(false)
    const [stageInfo, setInfo] = useState<any>()

    useEffect(() => {
        setNameError(error.name)
        setInfo(info)
    }, [error, info])

    return (
        <div>
            <TextField
                label="Stage name"
                maxLength={16}
                name="name"
                onChange={handleInfoChange}
                value={stageInfo && stageInfo.name}
                valueLength={valueLength && valueLength.name}
                error={nameError}
                errorMessage="Stage name is required"
            />
            <TextField
                label="Password"
                maxLength={16}
                name="password"
                onChange={handleInfoChange}
                value={stageInfo && stageInfo.password}
                valueLength={valueLength && valueLength.password}
            />
        </div>
    )
}

export default AddInformatinStep