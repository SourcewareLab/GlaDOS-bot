export interface TimeZone {
  name: string;
  value: {
    name: string;
    isPositive: boolean;
    hours: number;
    minutes: number;
  }
}

export interface TimeConverter {
  hours: number;
  minutes: number;
  timeZoneGiven: TimeZone;
  timeZoneConvert: TimeZone
}

export enum DayDiff {
  SameDay,
  NextDay,
  PrevDay
}

export interface TimeResponse {
  hours: number;
  minutes: number;
  day: DayDiff;
}

export function ConvertTime(timeConverter: TimeConverter) {
  const givenZoneVal = timeConverter.timeZoneGiven.value
  const convertZoneVal = timeConverter.timeZoneConvert.value

  const expressionHours = `${(givenZoneVal.isPositive) ? '+' : '-'} ${givenZoneVal.hours} ${(convertZoneVal.isPositive) ? '+' : '-'} ${convertZoneVal.hours}`
  const expressionMinutes = `${(givenZoneVal.isPositive) ? '+' : '-'} ${givenZoneVal.minutes} ${(convertZoneVal.isPositive) ? '+' : '-'} ${convertZoneVal.minutes}`

  const hoursDiff = eval(expressionHours)
  const minutesDiff = eval(expressionMinutes)

  const convertedHours = timeConverter.hours + hoursDiff
  const connvertedMinutes = timeConverter.minutes + minutesDiff

  console.log(convertedHours, connvertedMinutes);

  return boundsCheck(convertedHours, connvertedMinutes)
}

function boundsCheck(hours: number, minutes: number) {
  let day = 0;

  if (minutes >= 60) {
    hours += 1;
    minutes -= 60;
  } else if (minutes < 0) {
    hours -= 1;
    minutes += 60;
  }

  if (hours >= 24) {
    hours -= 24;
    day += 1;
  } else if (hours < 0) {
    hours += 24;
    day -= 1;
  }

  const response: TimeResponse = {
    hours: hours,
    minutes: minutes,
    day: DayDiff.SameDay
  }

  if (day === -1) {
    response.day = DayDiff.PrevDay;
  } else if (day === 0) {
    response.day = DayDiff.SameDay;
  } else {
    response.day = DayDiff.NextDay;
  }

  return response
}
