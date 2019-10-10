
import React, { Component } from 'react'

import SideBar from './main-content/SideBar.jsx'
import Content from './main-content/Content.jsx'
import Player from './main-content/Player.jsx'

export default class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedScreen: 'discover'
    }
  }

  updateScreen = screen => this.setState({selectedScreen: screen})
  
  render() {

    const {user} = this.props
    const {selectedScreen} = this.state
  
    return (
      <div className='main' >
        <SideBar
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        <Content />
        <Player />
      </div>
    )
  }
}
