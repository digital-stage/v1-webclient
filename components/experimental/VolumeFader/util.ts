

export type Infinity = "-∞";

/***
 * Calulcate the db measurement with an value between 0 and 1
 * @param value, float value between 0 and 1
 */
export const calculateDbMeasurement = (value: number): number | Infinity => {
    if (value > 0) {
        return (20 * Math.log10(value));
    }
    return "-∞";
}
