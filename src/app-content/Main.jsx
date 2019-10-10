
import React, { Component } from 'react'

import SideBar from './main-content/SideBar.jsx'
import Content from './main-content/Content.jsx'
import Player from './main-content/Player.jsx'

export default class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }
  
  render() {

    const {user} = this.props
  
    return (
      <div className='main' >
        <SideBar
          user={user} />
        <Content />
        <Player />
      </div>
    )
  }
}
