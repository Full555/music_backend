const FullPlayer = ({
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
    playMode,
    togglePlayMode,
    isFavorite,
    toggleFavorite,
    openAddToPlaylist,
    setShowFullPlayer
}) => {
    return (
        <div className="full-player-overlay" onClick={() => setShowFullPlayer(false)}>
            <div className="full-player-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-full-player" onClick={() => setShowFullPlayer(false)}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <button className="play-mode-btn" onClick={togglePlayMode}>
                    {playMode === 'normal' && <i className="fa-solid fa-repeat" style={{ opacity: 0.4 }}></i>}
                    {playMode === 'repeat' && <i className="fa-solid fa-repeat"></i>}
                    {playMode === 'shuffle' && <i className="fa-solid fa-shuffle"></i>}
                </button>
                <div className="full-player-art">
                    <img src={currentTrack.thumbnail} alt={currentTrack.title} className={isPlaying ? 'playing-animation' : ''} />
                </div>
                <div className="full-player-info">
                    <h3 className="full-player-title">{currentTrack.title}</h3>
                    <p className="full-player-artist">{currentTrack.artist}</p>
                </div>
                <div className="full-player-progress-container" onClick={(e) => seekTo(e, e.currentTarget)}>
                    <div className="full-player-progress" style={{ width: `${progressPercent}%` }}></div>
                </div>
                <div className="full-player-times">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="full-player-controls">
                    <button className="full-player-btn" onClick={handlePrev}>
                        <i className="fa-solid fa-backward-step"></i>
                    </button>
                    <button className="full-player-btn play-btn-large" onClick={() => isPlaying ? pauseAudio() : playAudio()}>
                        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <button className="full-player-btn" onClick={handleNext}>
                        <i className="fa-solid fa-forward-step"></i>
                    </button>
                </div>
                <div className="full-player-extra">
                    <button
                        className={`full-player-like ${isFavorite(currentTrack?.id) ? 'liked' : ''}`}
                        onClick={() => toggleFavorite(currentTrack)}
                    >
                        <i className="fa-solid fa-heart"></i> {isFavorite(currentTrack?.id) ? 'В избранном' : 'В избранное'}
                    </button>
                    <button className="add-to-playlist-btn" onClick={() => openAddToPlaylist(currentTrack)}>
                        <i className="fa-solid fa-folder-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FullPlayer