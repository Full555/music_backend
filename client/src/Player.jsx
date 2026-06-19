const Player = ({ url }) => {
  if (!url) return null;
  return (
    <div style={{ position: 'fixed', bottom: '60px', width: '100%', zIndex: 1000, background: '#1c1c1c', padding: '5px' }}>
      <ReactPlayer 
        url={url} 
        playing={true} 
        controls={true} 
        volume={0.8}
        width="100%" 
        height="50px" 
        config={{
          youtube: {
            playerVars: { autoplay: 1, modestbranding: 1 }
          }
        }}
        onError={(err) => console.error("Ошибка плеера:", err)}
      />
    </div>
  );
};