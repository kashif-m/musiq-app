
import React, { Component } from 'react'

import Discover from './screens/Discover.jsx'
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

  updateSearchResults = searchResults => this.setState({searchResults})
  
  render() {

    const [musicProvider, updateMusicProvider] = this.props.musicProvider
    const [playingNow, updatePlayingNow] = this.props.playingNow
    const [selectedScreen, updateScreen] = this.props.screen
    const {searchResults} = this.state
  
    return (
      <div className='main--content' >
        {
          selectedScreen === 'discover' ?
          <Discover />
          : selectedScreen === 'music' ?
          <Liked />
          : selectedScreen === 'playlist' ?
          <Playlist />
          : selectedScreen === 'search' ?
          <Search
            musicProvider={[musicProvider, updateMusicProvider]}
            user={this.props.user}
            searchResults={[searchResults, this.updateSearchResults]}
            playingNow={[playingNow, updatePlayingNow]} />
          : null
        }
      </div>
    )
  }
}
