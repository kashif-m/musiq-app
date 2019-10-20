
import React, {useState, useEffect} from 'react'

export default props => {

  const {playingNow, user} = props
  const [fullscreen, setFullscreen] = useState(false)
  const [title, setTitle] = useState(playingNow.title)

  useEffect(() => {

    console.log(fullscreen)
    if(playingNow.title.length > 20 && !fullscreen)
      setTitle(playingNow.title.slice(0, 20) + '...')
    else
      setTitle(playingNow.title)

  }, [playingNow, fullscreen])

  const renderPlayer = () => {

    return (
      <div className="music-player">

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
      <div className="img">IMG</div>
      <div className="song-details">
        <div className="title">{title}</div>
        <div className="artist">{playingNow.artist}</div>
      </div>
      <div className="song-options">
        <img src={require('../assets/images/plus.svg')} alt="+"
          className='save' />
        <img src={require('../assets/images/up-arrow.svg')} alt="^"
          className='fullscreen'
          onClick={() => setFullscreen(!fullscreen)} />
      </div>
      {renderPlayer()}
    </div>
  )
}
