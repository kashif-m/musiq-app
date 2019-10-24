
import React, { Component } from 'react'

import AuthScreen from './main-content/AuthScreen.jsx'
import Content from './main-content/Content.jsx'
import SideBar from './main-content/SideBar.jsx'

export default class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedScreen: 'search',
      showAuthScreen: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(JSON.stringify(nextProps.playingNow[0]) !== JSON.stringify(this.props.playingNow[0]) &&
      JSON.stringify(nextProps.user[0]) === JSON.stringify(nextProps.user[0]) &&
      JSON.stringify(nextProps.token) === JSON.stringify(nextProps.token))
      return false
    return true
  }

  updateScreen = screen => this.setState({selectedScreen: screen})
  updateAuthScreen = val => this.setState({showAuthScreen: val})
  
  render() {

    const {token, getSpotifyCode} = this.props
    const [user, updateUser] = this.props.user
    const [playingNow, updatePlayingNow] = this.props.playingNow
    const {selectedScreen, showAuthScreen} = this.state
    console.log(showAuthScreen)
  
    return (
      <div className='main' >
        <SideBar
          authScreen={[showAuthScreen, this.updateAuthScreen]}
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        <Content
          playingNow={[playingNow, updatePlayingNow]}
          token={token}
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        {
          showAuthScreen ?
          <AuthScreen
            getSpotifyCode={getSpotifyCode}
            authScreen={[showAuthScreen, this.updateAuthScreen]}
            user={[user, updateUser]} />
          : null
        }
      </div>
    )
  }
}
