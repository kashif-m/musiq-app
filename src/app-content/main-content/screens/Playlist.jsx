
import React, {useState, useEffect} from 'react'

export default props => {

  const [playlists, setPlaylists] = useState(false)

  const renderPlaylists = () => {
    return (
      <div className="playlist--list">
      
      </div>
    )
  }

  return (
    <div className="playlists">
      <div className="heading">Playlists</div>
      {
        !playlists ?
        <React.Fragment>
          <div className="empty">No saved playlist found.</div>
          <div className="create-playlist">+ Create Playlist</div>
        </React.Fragment>
        : <React.Fragment>
            <div className="create-playlist">+ Create Playlist</div>
            { renderPlaylists() }
        </React.Fragment>
      }
    </div>
  )
}
