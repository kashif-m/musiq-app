
import React, { Component } from 'react'

import Liked from './screens/Liked.jsx'
import Playlist from './screens/Playlist.jsx'
import Search from './screens/Search.jsx'

export default class Content extends Component {

  constructor(props) {
    super(props)

    this.state = {
      searchResults: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    const [selectedScreen, updateScreen] = this.props.screen
    
    if(this.props.musicProvider[0] !== nextProps.musicProvider[0] &&
        selectedScreen === 'search') {
      this.setState({searchResults: false})
      return false
    }
    return true
  }

  updateSearchResults = searchResults => this.setState({searchResults})

  render() {

    const [musicProvider, updateMusicProvider] = this.props.musicProvider
    const [playingNow, updatePlayingNow] = this.props.playingNow
    const [selectedScreen, updateScreen] = this.props.screen
    const {user, updateSongsInQueue} = this.props
    const {searchResults} = this.state
  
    return (
      <div className='main--content' >
        {
          selectedScreen === 'music' ?
          <Liked
            musicProvider={[musicProvider, updateMusicProvider]}
            updateSongsInQueue={updateSongsInQueue}
            likedSongs={user.likedSongs}
            playingNow={[playingNow, updatePlayingNow]} />
          : selectedScreen === 'playlist' ?
          <Playlist />
          : selectedScreen === 'search' ?
          <Search
            searchResults={[searchResults, this.updateSearchResults]}
            musicProvider={musicProvider}
            user={user}
            playingNow={[playingNow, updatePlayingNow]} />
          : null
        }
      </div>
    )
  }
}
