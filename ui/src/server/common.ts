import type { OverallData } from '../models/server';

const HOUR_IN_MS = 3600000;

function dataComparator(a: OverallData, b: OverallData) {
  return new Date(a.day).getTime() - new Date(b.day).getTime();
}

export function fillDateGapsWithZero(data: OverallData[]): OverallData[] {
  data = data.sort(dataComparator);

  const pointsToAdd: OverallData[] = [];
  data.forEach((dataPoint, index) => {
    if (index === data.length - 1) return;
    const _curr = new Date(dataPoint.day);
    let nextHour = new Date();
    nextHour.setTime(_curr.getTime() + HOUR_IN_MS);
    while (nextHour < new Date(data[index + 1].day)) {
      pointsToAdd.push({ day: nextHour.toISOString(), time: 0 });
      nextHour.setTime(nextHour.getTime() + HOUR_IN_MS);
    }
  });

  data.push(...pointsToAdd);

  data = data.sort(dataComparator);

  return data;
}
