interface DataPoint {
  time: number;
  day: Date;
}

interface TotalServerData {
  total: number; // total number of Person-Minutes
  data: DataPoint[];
}
