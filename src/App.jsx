
import React, { Component } from 'react'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'
import Player from './app-content/Player.jsx'

export default class App extends Component {

  state = {
    user: false,
    playingNow: {
      title: 'My Songs Know What You Did In The Dark (Light Em Up)',
      artist: 'Fall Out Boy',
      album: 'Save Rock and Roll',
      img: 'url'
    }
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
  }

  componentDidUpdate(prevProps, prevState) {

    if(JSON.stringify(prevState.user) !== JSON.stringify(this.state.user))
      if(Object.keys(this.state.user).length > 0)
        localStorage.setItem('musiq__user', JSON.stringify(this.state.user))
      else
        localStorage.removeItem('musiq__user')
  }

  updateUser = user => this.setState({user})
  updateSearch = search => this.setState({search})

  render() {

    const {user, playingNow, search} = this.state
    return (
      <div className='app' >
        <Header
          user={user}
          search={[search, this.updateSearch]} />
        <Main
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
