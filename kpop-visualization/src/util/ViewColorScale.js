import { scaleLinear } from 'd3';

const ViewColorScale = scaleLinear()
    .domain([0, 1000000, 30000000, 100000000])
    .range(["#56CCCE", "#A3E1DC", "#FFDBCB","#FCB9A9"])
    .clamp(true)
    
export default ViewColorScale;