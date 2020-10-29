
/***
 * Calulcate the db measurement with an value between 0 and 1
 * @param value, float value between 0 and 1
 */
export const convertRangeToDbMeasure = (value: number): number => {
    if (value > 0) {
        return (20 * Math.log10(value));
    }
    return Number.NEGATIVE_INFINITY;
}

export const convertDbMeasureToRange = (value: number): number => {
    return (Math.pow( value, 10)) / 20;
}

export const formatDbMeasure = (value: number): string => {
    if (value > Number.NEGATIVE_INFINITY)
        return value.toPrecision(2) + "db";
    return "-∞";
}