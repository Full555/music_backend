const PlaylistSelectModal = ({ playlists, addToPlaylist, setShowPlaylistSelect, trackToAdd }) => {
    return (
        <div className="playlist-select-overlay" onClick={() => { setShowPlaylistSelect(false); }}>
            <div className="playlist-select-modal" onClick={(e) => e.stopPropagation()}>
                <h4>Добавить в плейлист</h4>
                <div className="playlist-select-list">
                    {playlists.map(pl => (
                        <div key={pl.id} className="playlist-select-item" onClick={() => addToPlaylist(pl.id, trackToAdd)}>
                            <i className="fa-solid fa-music"></i>
                            <span>{pl.name}</span>
                            <i className="fa-solid fa-plus" style={{ fontSize: '14px', opacity: 0.7 }}></i>
                        </div>
                    ))}
                </div>
                <button className="create-playlist-cancel" onClick={() => setShowPlaylistSelect(false)} style={{ marginTop: '8px', width: '100%' }}>
                    Отмена
                </button>
            </div>
        </div>
    );
}
export default PlaylistSelectModal