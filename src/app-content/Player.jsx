
import React, {useState, useEffect} from 'react'
import Axios from 'axios'

export default props => {

  const {playingNow, user} = props
  const [fullscreen, setFullscreen] = useState(false)
  const [title, setTitle] = useState(playingNow.name)
  let player = false

  useEffect(() => {

    console.log(fullscreen)
    if(playingNow.name.length > 20 && !fullscreen)
      setTitle(playingNow.name.slice(0, 20) + ' ...')
    else
      setTitle(playingNow.name)

  }, [playingNow, fullscreen])

  const play = uri => {

    console.log(uri)
    if(player) {
      const data = {
        context_uri: uri,
      }
      const token = 'Bearer ' + user.spotify.access_token
      console.log(token)
      Axios.put('https://api.spotify.com/v1/me/player/play', data, {
        headers: {
          Authorization: token
        }})
        .then(res => console.log(res.data))
        .catch(err => console.log(err.response.data))
    }
  }

  const renderPlayer = () => {

    return (
      <div className="music-player">
        <div className="play-options">
          <img className='prev-song' src={require('../assets/images/previous.svg')} alt="<"/>
          <img className='play-song' src={require('../assets/images/play.svg')} alt="D"
            onClick={() => play('spotify:track:4iV5W9uYEdYUVa79Axb7Rh')} />
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
