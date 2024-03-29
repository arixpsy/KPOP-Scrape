import React, { useState, useRef } from 'react';
import ForceChart from './ForceChart';
import HoverModal from './HoverModal';
import Introduction from './slides/Introduction';
import ViewByType from './slides/ViewByType';
import HighestViewByYear from './slides/HighestViewByYear';
import YoutubePlayer from './YoutubePlayer';
import kpopData from '../src/data/kpop.json';
import './App.css';


function App() {
  const [data, setData] = useState(kpopData.data.slice(0,3000).filter(value => value.youtubeLinkStatus));
  const [hoveredItem , setHoveredItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showPlayer, setShowPlayer] = useState(null);
  const [cursorLocation, setCursorLocation] = useState(null);
  const [settings, setSettings] = useState({
    minCircleRadius: 5,
    maxCircleRadius: 50,
    forceManyBodyStrength: 0
  });
  const mainRef = useRef()

  function onMouseMove(event){
    setCursorLocation({ x : event.pageX, y : event.pageY });
  }
  
  function onWheelEvent(event){
    let delta;
    if (event.wheelDelta) { delta = event.wheelDelta; }
    else { delta = -1 * event.deltaY; }
    mainRef.current.scrollBy(0, -1 * delta)

    setTimeout(() => {
      let newSettings = settings
      if (mainRef.current.scrollTop === 0) {
        newSettings.forceManyBodyStrength = 21
      }else{
        newSettings.forceManyBodyStrength = -20
      }
      setSettings(newSettings)
    }, 500)

  }

  return <main ref={mainRef} onMouseMove={onMouseMove} onWheel={onWheelEvent}>
    <HoverModal data={hoveredItem} cursorLocation={cursorLocation} />
    <ForceChart data={data} setData={setData} settings={settings} setHoveredItem={setHoveredItem} dataLimit={kpopData.summary} setSelectedItem={setSelectedItem} setShowPlayer={setShowPlayer}/>
    <Introduction />
    <ViewByType data={data} />
    <HighestViewByYear data={data}  />
    <YoutubePlayer selectedItem={selectedItem} showPlayer={showPlayer} setShowPlayer={setShowPlayer } />
    {/* <ArtistView /> */}
    {/* <Summary /> */}
  </main>
}

export default App;
