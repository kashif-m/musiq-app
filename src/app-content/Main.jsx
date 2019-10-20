
import React, { Component } from 'react'

import AuthScreen from './main-content/AuthScreen.jsx'
import Content from './main-content/Content.jsx'
import SideBar from './main-content/SideBar.jsx'

export default class Main extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedScreen: 'search',
      showAuthScreen: 'login'
    }
  }

  updateScreen = screen => this.setState({selectedScreen: screen})
  updateAuthScreen = val => this.setState({showAuthScreen: val})
  
  render() {

    const [user, updateUser] = this.props.user
    const {selectedScreen, showAuthScreen} = this.state
  
    return (
      <div className='main' >
        <SideBar
          authScreen={[showAuthScreen, this.updateAuthScreen]}
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        <Content
          screen={[selectedScreen, this.updateScreen]}
          user={user} />
        {
          showAuthScreen ?
          <AuthScreen
            authScreen={[showAuthScreen, this.updateAuthScreen]}
            user={[user, updateUser]} />
          : null
        }
      </div>
    )
  }
}
