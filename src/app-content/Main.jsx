
import React, { Component } from 'react'
import axios from 'axios'

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

  componentDidMount() {

    const [user, updateUser] = this.props.user
    // if(!user && this.state.selectedScreen === 'local-music')
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(JSON.stringify(nextProps.playingNow[0]) !== JSON.stringify(this.props.playingNow[0]) &&
      JSON.stringify(nextProps.user[0]) === JSON.stringify(nextProps.user[0]) &&
      nextProps.musicProvider[0] === this.props.musicProvider[0])
      return false
    return true
  }

  componentDidUpdate(prevProps, prevState) {
    
    const [pU, uPU] = prevProps.user
    const [user, updateUser] = this.props.user
    const [pMP, uPMP] = prevProps.musicProvider
    const [mP, uMP] = this.props.musicProvider
    if(!prevProps.user && JSON.stringify(user) !== JSON.stringify(pU)
      || user && !user.likedSongs) {
      axios.get('http://localhost:5000/user-data/liked-music', {headers: {Authorization: user.token}})
        .then(res => {
          const temp = {...user}
          temp.likedSongs = res.data
          updateUser(temp)
        })
        .catch(err => console.log(err.response.data))
    }

    if(mP !== pMP && this.state.selectedScreen === 'device' && mP !== 'device')
      this.setState({selectedScreen: 'search'})
  }

  updateScreen = screen => this.setState({selectedScreen: screen})
  updateAuthScreen = val => this.setState({showAuthScreen: val})
  
  render() {

    const {getSpotifyCode, updateSongsInQueue} = this.props
    const [user, updateUser] = this.props.user
    const [musicProvider, updateMusicProvider] = this.props.musicProvider
    const [playingNow, updatePlayingNow] = this.props.playingNow
    const {selectedScreen, showAuthScreen} = this.state
  
    return (
      <div className='main' >
        <SideBar
          musicProvider={[musicProvider, updateMusicProvider]}
          authScreen={[showAuthScreen, this.updateAuthScreen]}
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        <Content
          updateSongsInQueue={updateSongsInQueue}
          musicProvider={[musicProvider, updateMusicProvider]}
          playingNow={[playingNow, updatePlayingNow]}
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
