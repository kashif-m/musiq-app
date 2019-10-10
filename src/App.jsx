
import React, { Component } from 'react'

import Header from './app-content/Header.jsx'
import Main from './app-content/Main.jsx'

export default class App extends Component {

  state = {
    user: false
  }

  render() {

    const {user} = this.state
    return (
      <div className='app' >
        <Header
          user={user} />
        <Main
          user={user} />
      </div>
    )
  }
}
