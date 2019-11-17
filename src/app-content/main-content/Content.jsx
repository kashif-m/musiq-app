
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

  updateSearchResults = searchResults => this.setState({searchResults})

  render() {

    const [musicProvider, updateMusicProvider] = this.props.musicProvider
    const [playingNow, updatePlayingNow] = this.props.playingNow
    const [selectedScreen, updateScreen] = this.props.screen
    const {user, updateSongsInQueue} = this.props
    const {searchResults, metadata} = this.state
  
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
          : selectedScreen === 'local-music' ?
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
