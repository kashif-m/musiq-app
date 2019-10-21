
import React, {useState, useEffect} from 'react'

export default props => {

  const {playingNow, user} = props
  const [fullscreen, setFullscreen] = useState(true)
  const [title, setTitle] = useState(playingNow.name)

  useEffect(() => {

    console.log(fullscreen)
    if(playingNow.name.length > 20 && !fullscreen)
      setTitle(playingNow.name.slice(0, 20) + ' ...')
    else
      setTitle(playingNow.name)

  }, [playingNow, fullscreen])

  const renderPlayer = () => {

    return (
      <div className="music-player">
        <div className="play-options">
          <img className='prev-song' src={require('../assets/images/previous.svg')} alt="<"/>
          <img className='play-song' src={require('../assets/images/play.svg')} alt="D"/>
          <img className='next-song' src={require('../assets/images/next.svg')} alt=">"/>
        </div>
        <div className="duration"></div>
      </div>
    )
  }
  
  return (
    <div className={`player${fullscreen ? ' fullscreen' : ''}`} >
      {
        fullscreen && <img className='close'
          src={require('../assets/images/close.svg')} alt="x"
          onClick={() => setFullscreen(false)} />
      }
      <img className='track-cover' alt=''
        src={fullscreen ? playingNow.album.images[0].url : playingNow.album.images[1].url} />
      <div className="song-details">
        <div className="title">{title}</div>
        <div className="artist">{playingNow.artists[0].name}</div>
      </div>
      <div className="song-options">
        <img src={require('../assets/images/plus.svg')} alt="+"
          className='save' />
        {
          !fullscreen ?
          <img src={require('../assets/images/up-arrow.svg')} alt="^"
            className='fullscreen'
            onClick={() => setFullscreen(!fullscreen)} />
          : null
        }
      </div>
      {renderPlayer()}
    </div>
  )
}
