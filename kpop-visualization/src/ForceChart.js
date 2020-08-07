import React, { useRef, useEffect} from 'react';
import { select, forceSimulation, forceCenter, forceCollide , forceManyBody, scaleLinear} from 'd3';
import ViewColorScale from './util/ViewColorScale';
import UseResizeObserver from './util/UseResizeObserver';

function ForceChart({ data, settings, setHoveredItem, dataLimit }){
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = UseResizeObserver(wrapperRef);

    useEffect(() => {
        // console.log(data)
        // console.log(dimensions)
        // console.log(dataLimit)

        const svg = select(svgRef.current)
        if ( !dimensions ) return;
        
        const sizeScale = scaleLinear()
            .domain([0, dataLimit.highestViews])
            .range([settings.minCircleRadius , settings.maxCircleRadius])

        const simulation =  forceSimulation(data)
            .force("center", forceCenter(dimensions.width / 2, dimensions.height / 2))
            .force("collide", forceCollide((value) => {return sizeScale(value.youtubeViewCount) + 2}))
            .force("charge", forceManyBody().strength(settings.forceManyBodyStrength))
            .on("tick", () => {
                svg
                    .selectAll('.song')
                    .data(data)
                    .join("circle")
                    .attr("class", "song")
                    .attr('cx', node => node.x)
                    .attr('cy', node => node.y)
                    .on("mouseover", value => {
                        setHoveredItem(value)
                    })
                    .on("mouseout", () =>{
                        setHoveredItem(null)
                    })
                    .transition()
                    .attr("r", value => { return sizeScale(value.youtubeViewCount) })
                    .attr("fill", value => ViewColorScale(value.youtubeViewCount))
            })
        simulation.restart();

    }, [data, dimensions, dataLimit, settings.forceManyBodyStrength, setHoveredItem]);

    return <div ref={wrapperRef} className="svgWrapper">
        <svg ref={svgRef}></svg>
    </div>
}

export default ForceChart;