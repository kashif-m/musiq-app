
import React, {useState, useEffect} from 'react'
import SVG from 'react-inlinesvg'

import SpotifyIcon from '../../../assets/images/spotify.svg'
import YoutubeIcon from '../../../assets/images/youtube.svg'

export default props => {

  const {likedSongs, updateSongsInQueue} = props
  const [playingNow, updatePlayingNow] = props.playingNow

  const renderSongList = () => {
    return (
      <div className="song-list">
        {
          likedSongs.map(song => {

            const {data, _id, from} = song
            return (
              <div className="song" key={_id} >
                {from === 'youtube' ? <SVG src={YoutubeIcon} className='from' /> : <SVG src={SpotifyIcon} className='from' />}
                <img src={data.snippet.thumbnails.medium.url} alt=""
                  onClick={() => updatePlayingNow(data)} />
                <div className="title"
                  onClick={() => updatePlayingNow(data)} >{data.snippet.title}</div>
                <div className="artist">{data.snippet.channelTitle}</div>
              </div>
            )
          }).reverse()
        }
      </div>
    )
  }

  const shuffle = array => {

    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }

    return array
  }

  const renderPlayButtons = () => (
    <div className="play-buttons">
      <div className="play"
        onClick={() => updateSongsInQueue(likedSongs.map(song => song.data).reverse())} >Play</div>
      <div className="shuffle"
        onClick={() => updateSongsInQueue(shuffle(likedSongs.map(song => song.data).reverse()))} >Shuffle Play</div>
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
