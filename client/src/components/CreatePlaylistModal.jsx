const CreatePlaylistModal = ({ setShowCreateModal, newPlaylistName, setNewPlaylistName, confirmCreatePlaylist }) => {
    return (
        <div className="create-playlist-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="create-playlist-modal" onClick={(e) => e.stopPropagation()}>
                <h4>Название плейлиста</h4>
                <input
                    className="create-playlist-input"
                    placeholder="Введите название"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    autoFocus
                />
                <div className="create-playlist-buttons">
                    <button className="create-playlist-cancel" onClick={() => setShowCreateModal(false)}>Отмена</button>
                    <button className="create-playlist-confirm" onClick={confirmCreatePlaylist}>Создать</button>
                </div>
            </div>
        </div>
    );
}
export default CreatePlaylistModal