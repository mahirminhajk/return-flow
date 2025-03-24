enum TimeUnits {
    HOUR = 'h',
    MINUTE = 'm',
    DAY = 'd',
    SECOND = 's',
}

type TimeInput = `${number}${TimeUnits}`;

export function getMilliseconds(time: TimeInput): number {
    const value = parseInt(time.slice(0, -1));
    const unit = time.slice(-1) as TimeUnits;
    let multiplier = 1;
    switch (unit) {
        case TimeUnits.HOUR:
            multiplier = 60 * 60 * 1000;
            break;
        case TimeUnits.MINUTE:
            multiplier = 60 * 1000;
            break;
        case TimeUnits.DAY:
            multiplier = 24 * 60 * 60 * 1000;
            break;
        case TimeUnits.SECOND:
            multiplier = 1000;
            break;
    }
    return value * multiplier;
}