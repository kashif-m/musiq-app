
import React, {useState, useEffect} from 'react'

export default props => {

  const {playingNow, user} = props
  const [title, setTitle] = useState(playingNow.title)

  useEffect(() => {

    if(playingNow.title.length > 20)
      setTitle(playingNow.title.slice(0, 20) + '...')

  }, [playingNow])

  const renderPlayer = () => {

    return (
      <div className="music-player">

      </div>
    )
  }
  
  return (
    <div className='player' >
      {
        // <img src={playingNow.img} alt="img"/>
      }
      <div className="img">IMG</div>
      <div className="title">{title}</div>
      <div className="artist">{playingNow.artist}</div>
      <div className="save">+</div>
      <div className="fullscreen">^</div>
      {renderPlayer()}
    </div>
  )
}
