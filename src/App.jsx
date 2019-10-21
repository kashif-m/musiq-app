
import React, { Component } from 'react'
import axios from 'axios'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'
import Player from './app-content/Player.jsx'

export default class App extends Component {

  state = {
    user: false,
    playingNow: {
      album: {
        images: [{
          url: null
        }, {
          url: null
        }]
      },
      name: 'Led Zepelin',
      artists: [{
        name: null
      }]
    },
    token: false
  }

  componentDidMount() {
    
    const userString = localStorage.getItem('musiq__user')

    if(userString)
      try {
        const user = JSON.parse(userString)
        this.setState({user})
      } catch(err) {
        localStorage.removeItem('musiq__user')
      }

    axios.get('http://localhost:5000/token')
      .then(res => !res.data.error ? this.setState({token: res.data}) : this.setState({token: false}))
      .catch(err => console.log(err))
  }

  componentDidUpdate(prevProps, prevState) {

    if(JSON.stringify(prevState.user) !== JSON.stringify(this.state.user))
      if(Object.keys(this.state.user).length > 0)
        localStorage.setItem('musiq__user', JSON.stringify(this.state.user))
      else
        localStorage.removeItem('musiq__user')
  }

  updateUser = user => this.setState({user})
  updatePlayingNow = song => this.setState({playingNow: song})

  render() {

    const {user, playingNow, token} = this.state
    return (
      <div className='app' >
        <Header
          user={user} />
        <Main
          playingNow={[playingNow, this.updatePlayingNow]}
          token={token}
          user={[user, this.updateUser]} />
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
