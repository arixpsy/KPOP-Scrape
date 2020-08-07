import React, { useRef, useEffect } from 'react';
import ViewColorScale from './util/ViewColorScale';

function HoverModal({ data, cursorLocation }){
    const modalRef = useRef();
    
    useEffect(() => {
        if (!data){
            modalRef.current.style.opacity = 0;
        }else{
            modalRef.current.style.opacity = 1;
        }
    }, [data, cursorLocation]);

    const modalStyle = {
        "--view__color" : ViewColorScale(data ? data.youtubeViewCount : 0),
        top : cursorLocation ? cursorLocation.y + 'px': '0px',
        left : cursorLocation ? cursorLocation.x - 150 + 'px': '0px',
        fontSize: "var(--default__fs)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#FFF",
        width: "300px",
        borderRadius: "var(--default__br)",
        position: "fixed",
        zIndex: 3,
        pointerEvents: "none"
    }
    
    const headerStyle = {
        backgroundColor: "var(--view__color)",
        borderRadius: "var(--default__br) var(--default__br) 0 0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px var(--default__padding)",
        fontWeight: 700,
        color: "var(--color__text)"
    }

    const bodyStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }

    return <div style={modalStyle} ref={modalRef} className="hover-modal">
        <div className="hover-modal__header" style={headerStyle}>
            <span>{data ? data.songName + " by " + data.artist : ""}</span>
        </div>
        <div className="hover-modal__body" style={bodyStyle}>
            <span>{data ? `Release Date: ${data.releaseDate}` : ""}</span>
            <span>{data ? `Artist Type: ${data.type}` : ""}</span>
            <span>{data ? `Youtube Views: ${data.youtubeViewCount}` : ""}</span>
            <span>{data ? `Youtube Comments: ${data.youtubeCommentCount}` : ""}</span>
            <span>{data ? `Youtube Likes: ${data.youtubeLikeCount}` : ""}</span>
        </div>
        
    </div>;
}

export default HoverModal;