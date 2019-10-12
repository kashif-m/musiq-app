
import React, { Component } from 'react'

import Discover from './screens/Discover.jsx'
import Liked from './screens/Liked.jsx'
import Playlist from './screens/Playlist.jsx'

export default class Content extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }
  
  render() {

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
          : null
        }
      </div>
    )
  }
}
