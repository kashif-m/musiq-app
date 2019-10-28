
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

  shouldComponentUpdate(nextProps, nextState) {
    
    if(this.props.musicProvider !== nextProps.musicProvider) {
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
            searchResults={[this.state.searchResults, this.updateSearchResults]}
            musicProvider={musicProvider}
            user={this.props.user}
            playingNow={[playingNow, updatePlayingNow]} />
          : null
        }
      </div>
    )
  }
}
