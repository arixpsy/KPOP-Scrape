import React,{ useState } from 'react'
import YouTube from 'react-youtube';

function YoutubePlayer({ selectedItem, showPlayer, setShowPlayer }){

    const playerOpts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
          },
    }

    
    return <div className={`youtube__container ${ showPlayer ? "expand" : ""}`} >
        <div className="playerToggle" onClick={()=>{setShowPlayer(!showPlayer)}}>{showPlayer ? "⬇" : "⬆"}</div>
        { selectedItem ? <YouTube 
            videoId={selectedItem.videoLink.split('/')[3]}
            opts={playerOpts}
            className="youtube__video"
            /> 
        : <div className="playerInstruction">Click on a dot to view its video</div>}
        
    </div>;
}

export default YoutubePlayer;