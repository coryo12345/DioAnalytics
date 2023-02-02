export function AreaChart(
  data: any,
  options: {
    x: (x: any) => any; // given d in data, returns the (temporal) x-value
    y: (y: any) => any; // given d in data, returns the (quantitative) y-value
    tooltipCallback: (d: any) => void;
    yLabel?: string;
  }
): SVGSVGElement | null;
