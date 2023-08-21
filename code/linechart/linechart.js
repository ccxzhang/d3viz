// var parseTime = d3.timeParse("%Y-%m-%d");
// const parseRows = function(d){
//     return {
//         Date: parseTime(d.date),
//         Price: d.Price
//     };
// };


d3.csv("../../data/btc-price-cleaned-2020.csv", d3.autoType)
    .then(data => {
        drawLineChart(data);
    });

const drawLineChart = (data) => {
    const margin = { top: 40, right: 170, bottom: 25, left: 40 };
    const width = 800;
    const height = 400;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const aubergine = "#75485E";

    var svg = d3.select('#line-chart')
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0, 0, ${width}, ${height}`);

    const innerChart = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // x-scale
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.Date; }))
        .range([0, innerWidth]);

    const bottomAxis = d3.axisBottom(xScale)
        .tickFormat(d3.timeFormat("%b"));

    innerChart
        .append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis);


    // y-scale (left)
    const maxPrice = d3.max(data, d => d.Price);
    const ylScale = d3.scaleLinear()
        .domain([0, maxPrice])
        .range([innerHeight, 0]);
    const leftAxis = d3.axisLeft(ylScale);

    innerChart
        .append("g")
        .attr("class", "axis-yl")
        .call(leftAxis);
    d3.selectAll(".axis-yl text")
        .attr("dx", "-1px");
    svg
        .append("text")
        .text("Price in USD")
        .attr("y", 20);

    // Right Axis
    // const maxVol = d3.max(data, d => d.Vol);
    // const yrScale = d3.scaleLinear()
    //     .domain([0, maxVol])
    //     .range([innerHeight, 0]);
    // const rightAxis = d3.axisRight(yrScale);
    // innerChart
    //     .append("g")
    //     .attr("class", "axis-yr")
    //     .call(rightAxis);


    // Area Chart
    const areaGenerator = d3.area()
        .x(d => xScale(d.Date))
        .y0(d => ylScale(d.Low))
        .y1(d => ylScale(d.High))
        .curve(d3.curveCatmullRom);

    innerChart
        .append("path")
        .attr("d", areaGenerator(data))
        .attr("fill", aubergine)
        .attr("fill-opacity", 1);

    // Line Chart
    const line = d3.line()
        .x(d => xScale(d.Date))
        .y(d => ylScale(d.Price))
        .curve(d3.curveCatmullRom);

    innerChart
        .attr("class", "line")
        .append("path")
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", aubergine);

    // Add tooltip and mouse 
    const tooltip = d3.select("#line-chart")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute");

    var mouseover = function (d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("stroke", "#EF4A60")
            .style("opacity", .5)
    }

    const mousemove = function (event, d) {
        const f = d3.format(",");
        const df = d3.timeFormat("%m-%d, %a");
        const [x, y] = d3.pointer(event);
        tooltip
            .html("<div>" + df(d.Date) + ": $" + f(d.Price) + "</div>")
            .style("top", (y + 40) + "px")
            .style("left", (x + 35) + "px")
            .style("font-size", "10px");
    };

    const mouseleave = function (d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            .style("stroke", "none")
            .style("opacity", 1)
    };

    innerChart
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("r", 1)
        .attr("cx", d => xScale(d.Date))
        .attr("cy", d => ylScale(d.Price))
        .attr("fill", aubergine)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

};