const PlaylistView = ({ viewedPlaylist, setViewedPlaylist, playTrack, currentTrack, setConfirmDelete }) => {
    return (
        <div className="playlist-view-overlay" onClick={() => setViewedPlaylist(null)}>
            <div className="playlist-view-header" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setViewedPlaylist(null)}><i className="fa-solid fa-arrow-left"></i></button>
                <span className="playlist-view-title">{viewedPlaylist.name}</span>
                <button
                    className="remove-track-btn"
                    style={{ marginLeft: 'auto' }}
                    onClick={() => setConfirmDelete({ type: 'playlist', playlistId: viewedPlaylist.id })}
                >
                    <i className="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <div className="playlist-view-tracklist" onClick={(e) => e.stopPropagation()}>
                {viewedPlaylist.tracks.length === 0 ? (
                    <p className="loading-text">Плейлист пуст</p>
                ) : (
                    viewedPlaylist.tracks.map(track => (
                        <div
                            key={track.id}
                            className={`playlist-view-track ${currentTrack?.id === track.id ? 'playing' : ''}`}
                            onClick={() => playTrack(track)}
                        >
                            <img src={track.thumbnail} alt={track.title} />
                            <div className="playlist-view-track-info">
                                <div className="playlist-view-track-name">{track.title}</div>
                                <div className="playlist-view-track-artist">{track.artist}</div>
                            </div>
                            <button
                                className="remove-track-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete({ type: 'track', playlistId: viewedPlaylist.id, trackId: track.id });
                                }}
                            >
                                <i className="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PlaylistView