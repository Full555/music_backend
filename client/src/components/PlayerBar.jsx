const PlayerBar = ({
    currentTrack,
    isPlaying,
    playAudio,
    pauseAudio,
    handlePrev,
    handleNext,
    currentTime,
    duration,
    progressPercent,
    formatTime,
    seekTo,
    isTrackInAnyPlaylist,
    openAddToPlaylist,
    setShowMiniMenu,
    playMode,
    togglePlayMode,
    setShowFullPlayer
}) => {
    return (
        <div className="player-bar">
            <div className="player-progress-container" onClick={(e) => seekTo(e, e.currentTarget)}>
                <div className="player-progress" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div className="player-meta" onClick={() => setShowFullPlayer(true)}>
                <img src={currentTrack.thumbnail} alt="" className="player-thumb" />
                <div className="player-meta-text">
                    <p className="player-title">{currentTrack.title}</p>
                    <p className="player-artist">{currentTrack.artist}</p>
                </div>
                <span className="player-time">{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>

            <div className="player-controls" onClick={(e) => e.stopPropagation()}>
                <button className="player-btn" onClick={handlePrev}>
                    <i className="fa-solid fa-backward"></i>
                </button>
                <button className="player-btn play-btn" onClick={() => isPlaying ? pauseAudio() : playAudio()}>
                    <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
                <button className="player-btn" onClick={handleNext}>
                    <i className="fa-solid fa-forward"></i>
                </button>
                <button
                    className={`player-btn player-playlist-btn ${isTrackInAnyPlaylist(currentTrack.id) ? 'in-playlist' : ''}`}
                    onClick={(e) => { e.stopPropagation(); openAddToPlaylist(currentTrack); }}
                >
                    <i className="fa-solid fa-folder-plus"></i>
                </button>
                <button className="player-btn player-menu-btn" onClick={(e) => { e.stopPropagation(); setShowMiniMenu(true); }}>
                    <i className="fa-solid fa-ellipsis"></i>
                </button>
            </div>
        </div>
    );
}

export default PlayerBar