
import React, { Component } from 'react'
import axios from 'axios'
import queryString from 'query-string'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'
import Player from './app-content/Player.jsx'

import {redirectURI, spotify} from './config/keys'

export default class App extends Component {

  state = {
    user: false,
    playingNow: false
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

    if(user && !user.code)
      this.getSpotifyCode(user)
    else if(user)
      this.setState({user})
  }

  componentDidUpdate(prevProps, prevState) {

    if(JSON.stringify(prevState.user) !== JSON.stringify(this.state.user))
      if(Object.keys(this.state.user).length > 0) {
        this.saveUser(this.state.user)
        if(Object.keys(queryString.parseUrl(window.location.href).query).length > 0)
          window.location.href = 'http://localhost:8080'
      }
      else
        localStorage.removeItem('musiq__user')
  }

  getSpotifyCode = user => {

    const {query} = queryString.parseUrl(window.location.href)

    if(!query.code)
      return window.location.replace(`https://accounts.spotify.com/authorize?client_id=${spotify.clientID}&response_type=code&redirect_uri=${redirectURI.dev}`)

    user.code = query.code
    this.setState({user})
  }

  saveUser = user => localStorage.setItem('musiq__user', JSON.stringify(user))
  updateUser = user => this.setState({user})
  updatePlayingNow = song => this.setState({playingNow: song})

  render() {

    const {user, playingNow, token} = this.state
    return (
      <div className='app' >
        <Header
          user={user} />
        <Main
          getSpotifyCode={this.getSpotifyCode}
          playingNow={[playingNow, this.updatePlayingNow]}
          token={token}
          user={[user, this.updateUser]} />
        {
          playingNow ?
          <Player
            token={token}
            playingNow={playingNow}
            user={user} />
          : null
        }
      </div>
    )
  }
}
