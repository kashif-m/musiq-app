
import React, { Component } from 'react'

import AuthScreen from './main-content/AuthScreen.jsx'
import Content from './main-content/Content.jsx'
import SideBar from './main-content/SideBar.jsx'
import Player from './main-content/Player.jsx'

export default class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedScreen: 'discover',
      playingNow: {
        title: 'My Songs Know What You Did In The Dark (Light Em Up)',
        artist: 'Fall Out Boy',
        album: 'Save Rock and Roll',
        img: 'url'
      },
      showAuthScreen: 'login'
    }
  }

  updateScreen = screen => this.setState({selectedScreen: screen})
  updateAuthScreen = val => this.setState({showAuthScreen: val})
  
  render() {

    const [user, updateUser] = this.props.user
    const {selectedScreen, playingNow, showAuthScreen} = this.state
  
    return (
      <div className='main' >
        <SideBar
          authScreen={[showAuthScreen, this.updateAuthScreen]}
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
        {
          showAuthScreen ?
          <AuthScreen
            authScreen={[showAuthScreen, this.updateAuthScreen]}
            user={[user, updateUser]} />
          : null
        }
      </div>
    )
  }
}
