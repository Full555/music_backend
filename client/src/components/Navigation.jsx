const Navigation = ({ activeTab, setActiveTab, setShowFullPlayer }) => {
    const tabs = [
        { id: 'home', icon: 'house-chimney', label: 'Главная' },
        { id: 'search', icon: 'magnifying-glass', label: 'Поиск' },
        { id: 'favorites', icon: 'heart', label: 'Избранное' },
        { id: 'profile', icon: 'user', label: 'Профиль' },
    ];

    return (
        <nav>
            <div className="nav-container">
                {tabs.map(({ id, icon, label }) => (
                    <button
                        key={id}
                        onClick={() => { setActiveTab(id); setShowFullPlayer(false); }}
                        className={`nav-btn ${activeTab === id ? 'active' : ''}`}
                    >
                        <i className={`fa-solid fa-${icon}`}></i>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
}

export default Navigation