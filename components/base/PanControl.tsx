import React from 'react';
import Slider from './Slider';
import {useTheme} from "@material-ui/core";

export default function PanControler() {
    const [deg, setDeg] = React.useState<number>(0)
    const theme = useTheme();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
        setDeg(newValue as number)
    }

    return (
        <div className="radialSlider" style={{textAlign: "center"}}>
            <Slider defaultValue={0} handleChange={handleChange} min={-130} max={130} step={10}/>
            <span>
                <svg version="1.1" width="50px" height="50px" viewBox="0 0 83.73 83.82">
                    <g
                        style={{
                            transform: `rotate(${deg}deg)`,
                            transformOrigin: "center",
                            cursor: "pointer",
                            pointerEvents: "all",
                            touchAction: "none"
                        }}
                    >
                        <circle className="jog" cx="41.42" cy="41.42" r="33"
                                style={{stroke: theme.palette.secondary.main, fill: "#A7A7A7"}}/>
                        <circle className="thumb" cx="42" cy="22" r="10" style={{
                            fill: theme.palette.secondary.main
                        }}
                        />
                    </g>
                    <path d="M12.66,70.19c-3.69-3.68-6.67-8.07-8.73-12.94S0.72,47.04,0.72,41.43s1.14-10.96,3.2-15.83
                         s5.04-9.25,8.73-12.94s8.07-6.67,12.94-8.73S35.8,0.72,41.41,0.72s10.96,1.14,15.83,3.2s9.25,5.04,12.94,8.73
                         s6.67,8.07,8.73,12.94c2.06,4.87,3.21,10.22,3.21,15.83s-1.14,10.96-3.2,15.83c-2.06,4.87-5.04,9.25-8.73,12.94"
                          style={{
                              stroke: theme.palette.secondary.main, fill: "none",
                              strokeWidth: 2,
                          }}/>
                    {/* <path className="barActive" d="M12.66,70.19c-3.69-3.68-6.67-8.07-8.73-12.94S0.72,47.04,0.72,41.43s1.14-10.96,3.2-15.83
                         s5.04-9.25,8.73-12.94s8.07-6.67,12.94-8.73S35.8,0.72,41.41,0.72s10.96,1.14,15.83,3.2s9.25,5.04,12.94,8.73
                         s6.67,8.07,8.73,12.94c2.06,4.87,3.21,10.22,3.21,15.83s-1.14,10.96-3.2,15.83c-2.06,4.87-5.04,9.25-8.73,12.94" style={{
                            fill: "none",
                            stroke: "#3f51b5",
                            strokeWidth: 1,
                            strokeMiterlimit: 10,
                            strokeDasharray: 191
                        }} /> */}
                </svg>
            </span>
        </div>
    )
}
