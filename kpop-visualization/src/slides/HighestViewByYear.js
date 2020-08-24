import React, { useRef, useEffect, useState } from 'react'
import { select, axisLeft, scaleBand, scaleLinear, max, min, zoom, zoomTransform } from 'd3';
import UseResizeObserver from '../util/UseResizeObserver';
import ViewColorScale from '../util/ViewColorScale';

function HighestViewByYear( { data } ){
    const svgRef = useRef();
    const wrapperRef = useRef();
    const inputRef = useRef();
    const dimensions = UseResizeObserver(wrapperRef);

    const years = data.map(value => new Date(value.releaseDate).getFullYear()).filter((value, index, self) => self.indexOf(value) === index);
    const [filterData, setFilterData] = useState(
        data
            .filter( value => new Date(value.releaseDate).getFullYear() === years[0])
            .sort((a, b) => b.youtubeViewCount - a.youtubeViewCount)
    )
    const [ currentZoomState, setCurrentZoomState] = useState()
    const [ hoveredItem, setHoveredItem] = useState(null);

    const valueIncrease = () => {
        if (Number(inputRef.current.value) === max(years)) return;
        inputRef.current.value = Number(inputRef.current.value) + 1
        setFilterData(
            data
                .filter( value => new Date(value.releaseDate).getFullYear() === Number(inputRef.current.value))
                .sort((a, b) => b.youtubeViewCount - a.youtubeViewCount)
        )
        setCurrentZoomState()
    }

    const valueDecrease = () => {
        if (Number(inputRef.current.value) === min(years)) return;
        inputRef.current.value = Number(inputRef.current.value) - 1
        setFilterData(
            data
                .filter( value => new Date(value.releaseDate).getFullYear() === Number(inputRef.current.value))
                .sort((a, b) => b.youtubeViewCount - a.youtubeViewCount)
        )
        setCurrentZoomState()

    }

    // console.log(years)
    // console.log(filterData)

    useEffect(() =>{
        const svg = select(svgRef.current)
        if(!dimensions) return;
        
        const yScale = scaleBand()
            .domain(filterData.map((value, index) => index))
            .range([0, filterData.length * 50])
            .paddingInner(0.1)

        const xScale = scaleLinear()
            .domain([0, max(filterData, entry => entry.youtubeViewCount)])
            .range([0 , dimensions.width -  25]);
        
        const yAxis = axisLeft(yScale).tickFormat( (value, index) => index + 1)

        svg
            .select('.y-axis')
            .call(yAxis)
            .style('transform', `translate(24px, ${(currentZoomState ? currentZoomState.y : 0)}px)`)
        svg
            .selectAll('.bar')
            .data(filterData, (value, index) => index)
            .join('rect')
            .attr('class', 'bar')
            .attr('x', 25)
            .attr('y', (entry, index) => yScale(index) + (currentZoomState ? currentZoomState.y : 0))
            .attr('width', entry => xScale(entry.youtubeViewCount))
            .attr('height', yScale.bandwidth)
            .attr('fill', entry => ViewColorScale(entry.youtubeViewCount))

        svg
            .selectAll(".label")
            .data(filterData, (value, index) => index)
            .join('text')
            .attr('class', 'label')
            .text(entry => `${entry.songName} by ${entry.artist}`)
            .attr('x', 35)
            .attr('y', (entry, index) => yScale(index) + 25 + 25 * 0.1 + (currentZoomState ? currentZoomState.y : 0))


        const zoomBehaviour = zoom()
            .translateExtent([[0, 0],[0, filterData.length * 50]])
            .scaleExtent([1, 1])
            .on('zoom', () => {
                const zoomState = zoomTransform(svg.node());
                setCurrentZoomState(zoomState)
            });
        
        svg.call(zoomBehaviour)

    }, [filterData, dimensions, data, currentZoomState])

    return <section className="section__highestViewByYear">
        <div>
            <h1>Highest Youtube Views by Year</h1>
            <div className="highestViewByYear_controls">
                <button onClick={valueDecrease}>◀</button>
                <input ref={inputRef} type="number" defaultValue={max(years)} min={min(years)} max={max(years)}/>
                <button onClick={valueIncrease}>▶</button>
            </div>
            <div ref={wrapperRef} className="svgContainer">
                <svg ref={svgRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
        </div>
    </section>
}

export default HighestViewByYear