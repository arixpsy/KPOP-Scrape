import React,{ useState } from 'react'
import YouTube from 'react-youtube';

function YoutubePlayer({ selectedItem, showPlayer, setShowPlayer }){

    const playerOpts = {
        height: '270',
        width: '480',
        playerVars: {
            autoplay: 1,
          },
    }

    
    return <div className={`youtube__container ${ showPlayer ? "expand" : ""}`} >
        <div className="playerToggle" onClick={()=>{setShowPlayer(!showPlayer)}}>{showPlayer ? "⬇" : "⬆"}</div>
        { selectedItem ? <YouTube 
            videoId={selectedItem.videoLink.split('/')[3]}
            opts={playerOpts}
            /> 
        : <div class="playerInstruction">Click on a dot to view its video</div>}
        
    </div>;
}

export default YoutubePlayer;