
import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import Script from 'react-load-script'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'
import Player from './app-content/Player.jsx'

import {spotify} from './config/keys'

export default class App extends Component {

  state = {
    user: false,
    playingNow: false,
    musicProvider: 'device',
    queue: {
      current: 0,
      playing: false,
      songs: []
    },
    loading: false
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
          window.location.href = this.getHostname()
      }
      else
        localStorage.removeItem('musiq__user')
  }

  getSpotifyCode = async user => {

    this.setState({loading: true})
    const {query} = queryString.parseUrl(window.location.href)
    const redirect_uri = this.getHostname()

    if(!query.code) {
      const scopes = encodeURI(["streaming", "user-read-email", "user-read-private", "user-modify-playback-state"].join(' '))
      return window.location.replace(`https://accounts.spotify.com/authorize?client_id=${spotify.clientID}&response_type=code&redirect_uri=${redirect_uri}&scope=${scopes}`)
    }

    const data = {
      code: query.code,
      grant_type: 'authorization_code',
      redirect_uri
    }
    const res = await axios.post('http://localhost:5000/token', data)
    console.log(res.data)
    if(!res.data.error) {
      user.spotify = res.data
      user.spotify.code = query.code
      user.spotify.timestamp = new Date().getTime()
      this.setState({user})
    } else
      this.updateSpotifyCode(user)
  }

  updateSpotifyCode = async user => {

    const data = {
      refresh_token: user.spotify.refresh_token,
      grant_type: 'refresh_token',
      redirect_uri: this.getHostname()
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

  getHostname = (href = window.location.href) => {
    let parser = document.createElement('a')
    parser.href = href
    return parser.origin
  }

  logout = () => {
    localStorage.removeItem('musiq__user')
    window.location.reload()
  }

  shouldUpdateMusicProvider = musicProvider => musicProvider !== this.state.musicProvider
  saveUser = user => localStorage.setItem('musiq__user', JSON.stringify(user))
  updateUser = user => this.setState({user})
  updatePlayingNow = (song, reset = true) => {
    if(reset)
      this.setState({queue: false})
    this.setState({playingNow: song})
    if(this.shouldUpdateMusicProvider(song.from))
      this.setState({musicProvider: song.from})
  }
  updateMusicProvider = (musicProvider, reset = false) => {
    this.setState({musicProvider})
    if(reset)
      this.setState({playingNow: false})
  }
  updateQueue = queue => this.setState({queue})
  updateSongsInQueue = (songs = {}, play = false) => {

    const {musicProvider} = this.state
    if(musicProvider !== songs[0].song.from)
      this.setState({musicProvider: songs[0].song.from})

    const temp = {...this.state.queue}
    temp.playing = play
    temp.songs = songs.map(savedTrack => {
      const temp = {...savedTrack.song.data}
      temp.from = savedTrack.song.from
      return temp
    })
    temp.current = 0
    this.setState({queue: temp, playingNow: temp.songs[0]})
  }

  render() {

    const {user, playingNow, musicProvider, queue, loading} = this.state
    return (
      <div className='app' >
        <Script url="https://sdk.scdn.co/spotify-player.js" />
        {loading && <div className="loading">LOADING . . .</div> }
        <Header
          logout={this.logout}
          user={user} />
        <Main
          queue={[queue, this.updateSongsInQueue]}
          musicProvider={[musicProvider, this.updateMusicProvider]}
          getSpotifyCode={this.getSpotifyCode}
          playingNow={[playingNow, this.updatePlayingNow]}
          user={[user, this.updateUser]} />
        {
          playingNow ?
          <Player
            updateMusicProvider={this.updateMusicProvider}
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
