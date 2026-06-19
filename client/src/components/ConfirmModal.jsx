const ConfirmModal = ({ confirmDelete, setConfirmDelete, handleDeletePlaylist, removeFromPlaylist }) => {
    return (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
                <p>{confirmDelete.type === 'playlist' ? 'Удалить плейлист?' : 'Удалить трек из плейлиста?'}</p>
                <div className="confirm-buttons">
                    <button className="confirm-no" onClick={() => setConfirmDelete(null)}>Нет</button>
                    <button
                        className="confirm-yes"
                        onClick={() => {
                            if (confirmDelete.type === 'playlist') handleDeletePlaylist(confirmDelete.playlistId);
                            else removeFromPlaylist(confirmDelete.playlistId, confirmDelete.trackId);
                        }}
                    >
                        Да
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal