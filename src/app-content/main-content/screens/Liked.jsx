
import React, {useState, useEffect} from 'react'

export default props => {

  const [likedSongs, updateLikedSongs] = useState(false)

  const renderSongList = () => {
    return (
      <div className="song-list">

      </div>
    )
  }
  
  return (
    <div className="liked-music">
      <div className="heading">Liked Music</div>
      <div className="liked-songs">
        {
          !likedSongs ?
          <div className="empty">Start saving your favorite songs for them to appear here.</div>
          : renderSongList()
        }
      </div>
    </div>
  )
}
