const ProfileSection = ({
    profileLogged,
    setProfileLogged,
    listenCount,
    playlists,
    setViewedPlaylist,
    openCreatePlaylistModal,
    setConfirmDelete
}) => {
    if (!profileLogged) {
        return (
            <div style={{ textAlign: 'center' }}>
                <h2>Профиль</h2>
                <p className="subtitle">Твой музыкальный профиль и настройки сессии.</p>
                <div className="avatar-placeholder"><i className="fa-solid fa-user-shield"></i></div>
                <button className="tg-button" onClick={() => setProfileLogged(true)}>
                    <i className="fa-brands fa-telegram" style={{ marginRight: '8px' }}></i> Подключить Telegram
                </button>
                <p style={{ fontSize: '13px', color: 'var(--hint-color)', marginTop: '14px' }}>
                    Привяжи аккаунт для синхронизации музыки
                </p>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <h2>Профиль</h2>
            <div className="avatar-placeholder"><i className="fa-solid fa-user"></i></div>
            <div className="profile-stats">
                <div className="stat-item">
                    <div className="stat-number">{listenCount}</div>
                    <div className="stat-label">Прослушано</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">⭐ 250</div>
                    <div className="stat-label">Telegram Stars</div>
                </div>
            </div>
            <div className="playlists-section">
                <div className="playlists-header">Плейлисты</div>
                {playlists.map(pl => (
                    <div key={pl.id} className="playlist-item" onClick={() => setViewedPlaylist(pl)}>
                        <div className="playlist-icon"><i className="fa-solid fa-music"></i></div>
                        <div className="playlist-info">
                            <div className="playlist-name">{pl.name}</div>
                            <div className="playlist-count">{pl.tracks.length} треков</div>
                        </div>
                        <i className="fa-solid fa-chevron-right" style={{ color: 'var(--hint-color)' }}></i>
                        <button
                            className="remove-track-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete({ type: 'playlist', playlistId: pl.id });
                            }}
                        >
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                ))}
                <button className="create-playlist-btn" onClick={openCreatePlaylistModal}>
                    <i className="fa-solid fa-plus"></i> {playlists.length === 0 ? 'Создать плейлист' : 'Создать'}
                </button>
            </div>
        </div>
    );
}
export default ProfileSection