const TrackCard = ({ track, playTrack, isFavorite, toggleFavorite, currentTrack }) => {
    return (
        <div
            key={track.id}
            className={`track-card ${currentTrack?.id === track.id ? 'playing' : ''}`}
            onClick={() => playTrack(track)}
        >
            <img src={track.thumbnail} alt={track.title} className="track-thumb" loading="lazy" />
            <div className="track-info">
                <h3 className="track-title">{track.title}</h3>
                <p className="track-artist">{track.artist}</p>
            </div>
            <button
                className={`like-btn ${isFavorite(track.id) ? 'liked' : ''}`}
                onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
            >
                <i className="fa-solid fa-heart"></i>
            </button>
        </div>
    );
}

export default TrackCard