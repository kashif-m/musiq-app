
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
    musicProvider: 'youtube',
    queue: {
      current: 0,
      playing: false,
      songs: []
    }
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

      if(!user)
        return
      const {spotify} = this.state.user
      if((spotify.timestamp + (spotify.expires_in * 1000)) > new Date().getTime())
        this.handleLoadSuccess()
      else
        this.updateSpotifyCode(this.state.user)
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

    if(prevState.musicProvider !== this.state.musicProvider)
      this.setState({playingNow: false})
  }

  getSpotifyCode = async user => {

    const {query} = queryString.parseUrl(window.location.href)

    if(!query.code) {
      const scopes = encodeURI(["streaming", "user-read-email", "user-read-private", "user-modify-playback-state"].join(' '))
      return window.location.replace(`https://accounts.spotify.com/authorize?client_id=${spotify.clientID}&response_type=code&redirect_uri=${redirectURI.dev}&scope=${scopes}`)
    }

    const data = {
      code: query.code,
      grant_type: 'authorization_code'
    }
    const res = await axios.post('http://localhost:5000/token', data)
    if(!res.data.error) {
      user.spotify = res.data
      user.spotify.code = query.code
      user.spotify.timestamp = new Date().getTime()
      this.setState({user})
    } else
      this.updateSpotifyCode(user)
  }

  updateSpotifyCode = async user => {

    console.log(user)
    const data = {
      refresh_token: user.spotify.refresh_token,
      grant_type: 'refresh_token'
    }
    const res = await axios.post('http://localhost:5000/token', data)
    if(!res.data.error) {
      res.data.refresh_token = user.spotify.refresh_token
      user.spotify = res.data
      user.spotify.code = res.data.code
      user.spotify.timestamp = new Date().getTime()
      this.saveUser(user)
      this.setState({user})
    } else console.log(res.data)
  }

  handleLoadSuccess = () => {

    const {user} = this.state
    const token = user.spotify.access_token

    const player = new window.Spotify.Player({
      name: 'musiq player',
      getOAuthToken: cb => { cb(token) }
    })
    // console.log(player)

    // Error handling
    player.addListener('initialization_error', ({ message }) => { console.error(message) })
    player.addListener('authentication_error', ({ message }) => { console.error(message); console.log('dsg') })
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
  updateQueue = queue => this.setState({queue})
  updateSongsInQueue = songs => {
    const temp = {...this.state.queue}
    temp.playing = true
    temp.songs = songs
    temp.current = 0
    this.setState({queue: temp})
    this.updatePlayingNow(temp.songs[0])
  }

  render() {

    const {user, playingNow, musicProvider, queue} = this.state
    return (
      <div className='app' >
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        <Header
          user={user} />
        <Main
          updateSongsInQueue={this.updateSongsInQueue}
          musicProvider={[musicProvider, this.updateMusicProvider]}
          getSpotifyCode={this.getSpotifyCode}
          playingNow={[playingNow, this.updatePlayingNow]}
          user={[user, this.updateUser]} />
        {
          playingNow ?
          <Player
            queue={[queue, this.updateQueue]}
            musicProvider={musicProvider}
            playingNow={playingNow}
            updatePlayingNow={this.updatePlayingNow}
            user={user}
            updateUser={this.updateUser} />
          : null
        }
      </div>
    )
  }
}
