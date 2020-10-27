export type Infinity = "-∞";
export type DbMeasurement = number | Infinity;


/***
 * Calulcate the db measurement with an value between 0 and 1
 * @param value, float value between 0 and 1
 */
export const calculateDbMeasurement = (value: number): number => {
    if (value > 0) {
        return (20 * Math.log10(value));
    }
    return Number.NEGATIVE_INFINITY;
}

export const dbMeasurementToRange = (value: number): number => {
    return (Math.pow( value, 10)) / 20;
}

export const formatDbMeasurement = (value: number): string => {
    if (value > Number.NEGATIVE_INFINITY)
        return value.toPrecision(2) + "db";
    return "-∞";
}

export class LogarithmicConverter {
    private readonly _linMin: number;
    private readonly _linMax: number;
    private readonly _logMin: number;
    private readonly _scale: number;

    constructor(min: number, max: number, minLog: number, maxLog: number) {
        this._linMin = min;
        this._linMax = max;
        this._logMin = minLog;
        this._scale = (Math.log(this._logMin) - Math.log(maxLog)) / (this._linMax - this._linMin);
    }

    invert(position: number): number {
        return Math.exp(Math.log(this._logMin) + this._scale * (position - this._linMin));
    }

    scale(value): number {
        return (Math.log(value) - Math.log(this._logMin)) / this._scale + this._linMin;
    }
}
