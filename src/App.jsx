
import React, { Component } from 'react'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'
import axios from 'axios'

export default class App extends Component {

  state = {
    user: false
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

  render() {

    const {user} = this.state
    return (
      <div className='app' >
        <Header
          user={user} />
        <Main
          user={[user, this.updateUser]} />
      </div>
    )
  }
}
