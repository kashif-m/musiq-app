
import React, {useState, useEffect} from 'react'
import SVG from 'react-inlinesvg'

import FolderIcon from '../../../assets/images/folder.svg'
import SpotifyIcon from '../../../assets/images/spotify.svg'
import YoutubeIcon from '../../../assets/images/youtube.svg'

export default props => {

  const {likedSongs, getLocalTrack, metadata} = props
  const [queue, updateSongsInQueue] = props.queue
  const [loading, updateLoading] = useState(true)

  useEffect(() => {
    const loading = deviceSongPresent() && !metadata
    updateLoading(loading)
  }, [likedSongs, metadata])

  const deviceSongPresent = () =>
    likedSongs ? likedSongs.filter(song => song.song.from === 'device').length > 0
    : true

  const renderLocalSong = savedTrack => {
    let filteredTracks = getLocalTrack(savedTrack.song.uniqueid)
    if(filteredTracks.length > 0) {
      const data = filteredTracks[0]
      const temp = {...savedTrack}
      temp.song.data = data
      let {picture, title, artist} = data.common
      return (
        <React.Fragment>
          <img src={picture[0].url} alt="loading ..."
            onClick={() => updateSongsInQueue([savedTrack], true)} />
          <div className="title">{title}</div>
          <div className="artist">{artist}</div>
        </React.Fragment>
      )
    }
  }

  const renderSongList = () => {
    return (
      <div className="song-list">
        {
          likedSongs.map(savedTrack => {
            const {song, savedOn} = savedTrack
            const {data, _id, from} = song
            return (
              <div className="song" key={_id} >
                { from === 'youtube' ? <SVG src={YoutubeIcon} className='from' />
                : from === 'spotify' ? <SVG src={SpotifyIcon} className='from' />
                : from === 'device' ? <SVG src={FolderIcon} className='from' /> : null }
                {
                  from === 'youtube' ?
                    <React.Fragment>
                      <img src={data.snippet.thumbnails.medium.url} alt=""
                        onClick={() => updateSongsInQueue([savedTrack], true)} />
                      <div className="title"
                        onClick={() => updateSongsInQueue([savedTrack], true)} >{data.snippet.title}</div>
                      <div className="artist">{data.snippet.channelTitle}</div>
                    </React.Fragment>
                  : from === 'device' ? renderLocalSong(savedTrack)
                  : null
                }
              </div>
            )
          })
        }
      </div>
    )
  }

  const shuffle = array => {

    const shuffledArray = [...array]

    for(let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = shuffledArray[i]
      shuffledArray[i] = shuffledArray[j]
      shuffledArray[j] = temp
    }
    return shuffledArray
  }

  const renderPlayButtons = () => (
    <div className="play-buttons">
      <div className={`play${queue && queue.playing ? 'ing' : ''}`}
        onClick={() => !queue || (queue && !queue.playing) ? updateSongsInQueue(likedSongs, true) : null } >
          {queue && queue.playing ? 'Playing' : 'Play'}
      </div>
      <div className="shuffle"
        onClick={() => updateSongsInQueue(shuffle(likedSongs), true)} >Shuffle Play</div>
    </div>
  )

  const likedSongsInfo = () => 
    <div className="empty">
      {!loading ? 'Start saving your favorite songs for them to appear here.' : 'Loading ...'}
    </div>

  return (
    <div className="liked-music">
      <div className="heading">
        <span>Liked Music</span>
        {
          likedSongs && renderPlayButtons()
        }
      </div>
      {
        !likedSongs || loading ? likedSongsInfo()
        : renderSongList()
      }
    </div>
  )
}
