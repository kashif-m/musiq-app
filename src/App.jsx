
import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import Script from 'react-load-script'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'
import Player from './app-content/Player.jsx'

import {redirectURI, spotify} from './config/keys'

export default class App extends Component {

  state = {
    user: false,
    playingNow: false,
    musicProvider: 'spotify'
  }

  componentDidMount() {
    
    const userString = localStorage.getItem('musiq__user')
    let user = false

    if(userString)
      try {
        user = JSON.parse(userString)
      } catch(err) {
        localStorage.removeItem('musiq__user')
      }

    if(user && !user.spotify)
      this.getSpotifyCode(user)
    else if(user)
      this.setState({user})

    window.onSpotifyWebPlaybackSDKReady = () => {
      this.handleLoadSuccess()
    }  
  }

  componentDidUpdate(prevProps, prevState) {

    if(JSON.stringify(prevState.user) !== JSON.stringify(this.state.user))
      if(Object.keys(this.state.user).length > 0) {
        this.saveUser(this.state.user)
        if(Object.keys(queryString.parseUrl(window.location.href).query).length > 0)
          window.location.href = redirectURI.dev
      }
      else
        localStorage.removeItem('musiq__user')
  }

  getSpotifyCode = async (user) => {

    const {query} = queryString.parseUrl(window.location.href)

    if(!query.code) {
      const scopes = encodeURI(["streaming", "user-read-email", "user-read-private", "user-modify-playback-state"].join(' '))
      return window.location.replace(`https://accounts.spotify.com/authorize?client_id=${spotify.clientID}&response_type=code&redirect_uri=${redirectURI.dev}&scope=${scopes}`)
    }

    const res = await axios.post('http://localhost:5000/token', {code: query.code})
    user.spotify = res.data
    user.spotify.code = query.code
    this.setState({user})
  }

  handleLoadSuccess = () => {

    const {user} = this.state
    const token = user.spotify.access_token

    const player = new window.Spotify.Player({
      name: 'musiq player',
      getOAuthToken: cb => { cb(token) }
    })
    console.log(player)

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message) })
    player.addListener('authentication_error', ({ message }) => { console.error(message) })
    player.addListener('account_error', ({ message }) => { console.error(message) })
    player.addListener('playback_error', ({ message }) => { console.error(message) })

    // Playback status updates
    player.addListener('player_state_changed', state => { console.log(state) })

    // Ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id)
    })

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id)
    })

    // Connect to the player!
    player.connect()
  }

  saveUser = user => localStorage.setItem('musiq__user', JSON.stringify(user))
  updateUser = user => this.setState({user})
  updatePlayingNow = song => this.setState({playingNow: song})
  updateMusicProvider = musicProvider => this.setState({musicProvider})

  render() {

    const {user, playingNow, musicProvider} = this.state
    return (
      <div className='app' >
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <Header
          user={user} />
        <Main
          musicProvider={[musicProvider, this.updateMusicProvider]}
          getSpotifyCode={this.getSpotifyCode}
          playingNow={[playingNow, this.updatePlayingNow]}
          user={[user, this.updateUser]} />
        {
          playingNow ?
          <Player
            musicProvider={[musicProvider, this.updateMusicProvider]}
            playingNow={playingNow}
            user={user} />
          : null
        }
      </div>
    )
  }
}
