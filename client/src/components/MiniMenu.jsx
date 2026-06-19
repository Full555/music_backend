const MiniMenu = ({ handleMiniMenuAction, playMode, togglePlayMode, isTrackInAnyPlaylist, currentTrack, setShowMiniMenu }) => {
    return (
        <div className="mini-menu-overlay" onClick={() => setShowMiniMenu(false)}>
            <div className="mini-menu" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleMiniMenuAction('add')}>
                    <i className="fa-solid fa-folder-plus"></i> Добавить в плейлист
                </button>
                {isTrackInAnyPlaylist(currentTrack?.id) && (
                    <button onClick={() => handleMiniMenuAction('remove')}>
                        <i className="fa-solid fa-trash-can"></i> Удалить из плейлиста
                    </button>
                )}
                <button onClick={() => handleMiniMenuAction('mode')}>
                    <i className={`fa-solid ${playMode === 'normal' ? 'fa-repeat' : playMode === 'repeat' ? 'fa-repeat' : 'fa-shuffle'}`}></i>
                    {playMode === 'normal' ? 'Повтор' : playMode === 'repeat' ? 'Повтор трека' : 'Перемешать'}
                </button>
            </div>
        </div>
    );
}

export default MiniMenu