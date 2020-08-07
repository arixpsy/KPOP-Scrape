import React, { useRef, useEffect } from 'react';
import { select, axisBottom, axisRight, scaleLinear, scaleBand } from 'd3';


function BarChart({ data, setData}){
    const svgRef = useRef();

    useEffect(() => {
        const svg = select(svgRef.current)
        //console.log(data)

        const xScale = scaleBand()
        .domain(data.map((value, index) => index))
        .range([0, 1000])
        .padding(0.8);
        const xScaleCategory = scaleBand()
        .domain(data.map(value => value.songName))
        .range([0, 1000])
        .padding(0.8);

        const colorScale = scaleLinear()
        .domain([10000, 100000, 1000000])
        .range(["green","orange","red"])
        .clamp(true)

        const yScale = scaleLinear()
        .domain([0, 1000000])
        .range([400, 0])

        const xAxis = axisBottom(xScaleCategory).ticks(data.length)
        const yAxis = axisRight(yScale);

        svg
        .select(".x-axis")
        .style("transform", "translateY(400px)")
        .call(xAxis)

        svg
        .select(".y-axis")
        .style("transform", "translateX(1000px)")
        .call(yAxis);

        svg
        .selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .style("transform", "scale(1,-1)")
        .attr("x", (value, index) => xScale(index))
        .attr("y", value => -400)
        .attr("width", xScale.bandwidth())
        .transition()
        .attr("fill", (value, index) => colorScale(value.youtubeLikeCount))
        .attr("height", value => 400 - yScale(value.youtubeLikeCount))
        


    }, [data]);

    return <React.Fragment>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
        <br/>
        <button onClick={ () => setData(data.map(value => {value.youtubeLikeCount = value.youtubeLikeCount + 10000;return value}))}>Update Data</button>
    </React.Fragment>
}

export default BarChart;