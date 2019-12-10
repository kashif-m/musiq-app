
import React, { Component } from 'react'
import axios from 'axios'

import Liked from './screens/Liked.jsx'
import LocalMusic from './screens/LocalMusic.jsx'
import Playlist from './screens/Playlist.jsx'
import Search from './screens/Search.jsx'

export default class Content extends Component {

  constructor(props) {
    super(props)

    this.state = {
      searchResults: false,
      metadata: false
    }
  }

  componentDidMount() {

    let urlCreator = window.URL || window.webkitURL

		axios.get('http://localhost:5000/local/path')
			.then(res => {
        const {metadata} = res.data
        metadata.map(song => {
          const {picture} = song.common
          if(picture) {
						const arrayBuffer = picture[0].data.data
						let arrayBufferView = new Uint8Array(arrayBuffer)
						let blob = new Blob([arrayBufferView], {type: "image/jpeg"})
            song.common.picture[0].url = urlCreator.createObjectURL(blob)
          }
        })
        this.setState({metadata})
      })
			.catch(err => console.log(err.response.data))
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

  getLocalTrack = path => this.state.metadata ? this.state.metadata.filter(track => track.path === path) : false
  updateSearchResults = searchResults => this.setState({searchResults})

  render() {

    const [musicProvider, updateMusicProvider] = this.props.musicProvider
    const [playingNow, updatePlayingNow] = this.props.playingNow
    const [selectedScreen, updateScreen] = this.props.screen
    const [queue, updateSongsInQueue] = this.props.queue
    const {user, getLocalTrack} = this.props
    const {searchResults, metadata} = this.state
  
    return (
      <div className='main--content' >
        {
          selectedScreen === 'music' ?
          <Liked
            getLocalTrack={this.getLocalTrack}
            metadata={metadata}
            queue={[queue, updateSongsInQueue]}
            likedSongs={user.likedSongs} />
          : selectedScreen === 'playlist' ?
          <Playlist />
          : selectedScreen === 'search' ?
          <Search
            metadata={metadata}
            searchResults={[searchResults, this.updateSearchResults]}
            musicProvider={musicProvider}
            user={user}
            playingNow={[playingNow, updatePlayingNow]} />
          : selectedScreen === 'device' ?
          <LocalMusic
            metadata={metadata}
            user={user}
            playingNow={[playingNow, updatePlayingNow]} />
          : null
        }
      </div>
    )
  }
}
