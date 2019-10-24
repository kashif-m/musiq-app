
import React, {useState, useEffect} from 'react'
import Script from 'react-load-script'

const uToken = 'BQAbpTiqd0AVGIXRbMis_rwQtCDTQwWja4DOKuMW5LrEJ7sNFdSYtM1eeyVYnqUEE3NZ32Ub5Z9vlJB28rDf_2MfjJZve-4vc4m0Z-kn7YAQ5AD86SWg7gxv-y9OQxkpfcieFoTnsFt6VQ3IH5RkmmEsK2JrqLI'
// const qToken = 'BQBPsWDo0B9V_p8TOfYOUrfOD4TGZpYUFgXwSUaHTVZ80o6guju3l01bYloqLppzf3O8uLYOqd4is_sguNPWLe2cN5ywx1z2wZRMaA5ADVEZwWJBlPPVybQQVrDqpMMLUY8sxFyB5DPgIOgxkOnohZnbrdB2Jyw'

export default props => {

  const {playingNow, user} = props
  const [fullscreen, setFullscreen] = useState(false)
  const [title, setTitle] = useState(playingNow.name)

  useEffect(() => {

    console.log(fullscreen)
    if(playingNow.name.length > 20 && !fullscreen)
      setTitle(playingNow.name.slice(0, 20) + ' ...')
    else
      setTitle(playingNow.name)

  }, [playingNow, fullscreen])

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      handleLoadSuccess()
    }
  }, [])

  const cb = token => token

  const handleLoadSuccess = () => {
    const token = uToken
    const player = new window.Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: cb => { cb(token); }
    });
    console.log(player);

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message); });
    player.addListener('authentication_error', ({ message }) => { console.error(message); });
    player.addListener('account_error', ({ message }) => { console.error(message); });
    player.addListener('playback_error', ({ message }) => { console.error(message); });

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();
  }

  const renderPlayer = () => {

    return (
      false ?
      <div className="music-player">
        <div className="play-options">
          <img className='prev-song' src={require('../assets/images/previous.svg')} alt="<"/>
          <img className='play-song' src={require('../assets/images/play.svg')} alt="D"/>
          <img className='next-song' src={require('../assets/images/next.svg')} alt=">"/>
        </div>
        <div className="duration"></div>
      </div>
      :
      <Script url="https://sdk.scdn.co/spotify-player.js" />
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
