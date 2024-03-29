import * as d3 from 'd3';

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/area-chart
export function AreaChart(data, {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    defined = hook => true, // given d in data, returns true if defined (for gaps)
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 1024, // outer width, in pixels
    height = 450, // outer height, in pixels
    xType = d3.scaleUtc, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    fillColor = "#43caff47", // fill color of area
    pointColor = '#43caff',
    tooltipCallback = () => { }
} = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    const I = d3.range(X.length);

    // Compute which data points are considered defined.
    if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
    const D = d3.map(data, defined);

    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X);
    if (yDomain === undefined) yDomain = [0, d3.max(Y)];

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
    // const xAxis = d3.axisBottom(xScale).ticks(d3.timeHour.every(1)).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    const tooltip = d3.select('.main-tooltip');

    // Construct an area generator.
    const area = d3.area()
        .defined(i => D[i])
        .curve(curve)
        .x(i => xScale(X[i]))
        .y0(yScale(0))
        .y1(i => yScale(Y[i]));

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("x", -1 * (height / 2))
            .attr("y", -1 * marginLeft + 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("transform", "rotate(-90)")
            .style("font-size", 20)
            .text(yLabel));

    svg.append("g")
        .attr("fill", pointColor)
        .attr("stroke", pointColor)
        .selectAll("circle")
        .data(I)
        .join("circle")
        .attr("cx", i => xScale(X[i]))
        .attr("cy", i => yScale(Y[i]))
        .attr("r", 5)
        .on('mouseover', (ev, i) => {
            tooltipCallback(data[i]);
            tooltip.attr('style', `display: block; left: ${ev.clientX}px; top: ${ev.clientY}px;`);
        })
        .on('mouseout', (ev, i) => {
            tooltip.attr('style', '');
        });

    svg.append("path")
        .attr("fill", fillColor)
        .attr("d", area(I));

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis);

    return svg.node();
}