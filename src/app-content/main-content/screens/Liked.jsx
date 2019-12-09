
import React, {useState, useEffect} from 'react'
import SVG from 'react-inlinesvg'

import SpotifyIcon from '../../../assets/images/spotify.svg'
import YoutubeIcon from '../../../assets/images/youtube.svg'

export default props => {

  const {likedSongs} = props
  const [queue, updateSongsInQueue] = props.queue

  const renderSongList = () => {
    
    return (
      <div className="song-list">
        {
          likedSongs.map(savedTrack => {
            const {song, savedOn} = savedTrack
            const {data, _id, from} = song
            return (
              <div className="song" key={_id} >
                {from === 'youtube' ? <SVG src={YoutubeIcon} className='from' /> : <SVG src={SpotifyIcon} className='from' />}
                <img src={data.snippet.thumbnails.medium.url} alt=""
                  onClick={() => updateSongsInQueue([savedTrack], true)} />
                <div className="title"
                  onClick={() => updateSongsInQueue([savedTrack], true)} >{data.snippet.title}</div>
                <div className="artist">{data.snippet.channelTitle}</div>
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
        onClick={() => updateSongsInQueue(likedSongs, true) } >
          {queue && queue.playing ? 'Playing' : 'Play'}
      </div>
      <div className="shuffle"
        onClick={() => updateSongsInQueue(shuffle(likedSongs), true)} >Shuffle Play</div>
    </div>
  )

  return (
    <div className="liked-music">
      <div className="heading">
        Liked Music
        {
          likedSongs && renderPlayButtons()
        }
      </div>
      {
        !likedSongs ?
        <div className="empty">Start saving your favorite songs for them to appear here.</div>
        : renderSongList()
      }
    </div>
  )
}
