import React, { useRef, useState, useEffect } from 'react'
import { select, pie, arc, interpolate, descending } from 'd3';
import UseResizeObserver from '../util/UseResizeObserver';
import ViewColorScale from '../util/ViewColorScale';

function ViewByType( { data } ){
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = UseResizeObserver(wrapperRef);
    const chartMargin = 20;
    const arcWidth = 45;
    const types = data.map(value => value.type).filter((value, index, self) => self.indexOf(value) === index);
    const [filterData, setFilterData] = useState(data.filter( value => value.type === types[0]));
    const [ hoveredItem, setHoveredItem] = useState(null);

    const selectionChange = (event) => {
        setFilterData(data.filter( value => value.type === event.target.value));
    }

    useEffect(() => {
        if ( !dimensions ) return;
        const svg = select(svgRef.current)
        const radius = Math.min(dimensions.height, dimensions.width) / 2 - chartMargin

        const arcGenerator = arc()
            .innerRadius(radius - arcWidth)
            .outerRadius(radius)

        const pieGenerator = pie()

        const pieValues = pieGenerator(filterData.map((value) => value.youtubeViewCount))
        
        svg.selectAll('.slice').remove()

        svg
            .selectAll('.slice')
            .data(pieValues)
            .join(
                enter => enter.append('path').style('opacity', 0),
                exit => exit.style('opacity', 0).remove()
            )
            .attr('class','slice')
            .attr('id', value => value.index)
            .attr('fill', value => ViewColorScale(value.data))
            .attr('stroke', value => ViewColorScale(value.data))
            .style('transform', `translate(${dimensions.width / 2}px ,${dimensions.height / 2}px)`)
            .on("mouseover", function(value) {
                svg.select(`.svgContainer [id="${value.index}"]`).attr('stroke', '#4d4d4d')
                setHoveredItem(filterData.sort((a, b) => descending(a.youtubeViewCount, b.youtubeViewCount))[value.index])
            })
            .on("mouseout", (value) =>{
                svg.select(`.svgContainer [id="${value.index}"]`).attr('stroke', 'none')
                setHoveredItem(null)
            })
            .transition()
            .style('opacity', 1)
            .attrTween('d', function(nextPieValue) {
                const interpolator = interpolate(this.prevPieValue, nextPieValue)
                this.prevPieValue = interpolator(1)
                return function(t) {
                    return arcGenerator(interpolator(t));
                };
            })
        }, [data, dimensions, filterData])

    return <section className="section__viewByType">
        <div>
            <h1>Youtube Views by Music Video Type</h1>
            <div>
                <form onChange={selectionChange}>
                    { types.map( (value, index) => {
                        let radioId = `${value}Radio`
                        return (
                            <React.Fragment key={radioId}>
                                <input  id={radioId} value={value} name="type" type="radio" defaultChecked={index===0}/>
                                <label htmlFor={radioId}>{value}</label>
                            </React.Fragment>
                        )
                    })}
                </form>
                <div ref={wrapperRef} className="svgContainer">
                    <div className="viewByType__content">
                        {hoveredItem ? (
                        <div className="viewByType__individual">
                            <h1>{hoveredItem ? hoveredItem.songName + " by " + hoveredItem.artist : ""}</h1>
                            <span>{hoveredItem ? `Release Date: ${hoveredItem.releaseDate}` : ""}</span>
                            <span>{hoveredItem ? `Youtube Views: ${hoveredItem.youtubeViewCount}` : ""}</span>
                            <span>{hoveredItem ? `Youtube Comments: ${hoveredItem.youtubeCommentCount}` : ""}</span>
                            <span>{hoveredItem ? `Youtube Likes: ${hoveredItem.youtubeLikeCount}` : ""}</span>
                        </div>
                        ) : (
                        <div className="viewByType__summary">
                            <h1>Total Music Videos</h1>
                            <p>{filterData.length}</p>
                            <br/>
                            <h1>Total Accumulated Views</h1>
                            <p>{filterData.map(value => value.youtubeViewCount).reduce(function (a, b) {return a + b}, 0)}</p>
                        </div>
                        
                        )}
                        <div className="hover-tooltip">
                            { "Hover over me".split("").map((value, index)=>{
                                let radius = 170;
                                return <span key={index} style={{transform : `rotate(${18 - index*3}deg)`, paddingTop: radius+'px'}}>{value}</span>
                            })}
                        </div>
                    </div>
                    <svg ref={svgRef}></svg>
                </div>
            </div>  
        </div>
    </section>
}

export default ViewByType;