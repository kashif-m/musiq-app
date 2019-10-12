
import React, { Component } from 'react'

import SideBar from './main-content/SideBar.jsx'
import Content from './main-content/Content.jsx'
import Player from './main-content/Player.jsx'

export default class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedScreen: 'playlist',
      playingNow: {
        title: 'My Songs Know What You Did In The Dark (Light Em Up)',
        artist: 'Fall Out Boy',
        album: 'Save Rock and Roll',
        img: 'url'
      }
    }
  }

  updateScreen = screen => this.setState({selectedScreen: screen})
  
  render() {

    const {user} = this.props
    const {selectedScreen, playingNow} = this.state
  
    return (
      <div className='main' >
        <SideBar
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        <Content
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        {
          playingNow ?
          <Player
            playingNow={playingNow}
            user={user} />
          : null
        }
      </div>
    )
  }
}
