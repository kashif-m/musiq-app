
import React, { Component } from 'react'

export default class SideBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }

  renderLoginScreen = () => {

    const [showAuthScreen, updateAuthScreen] = this.props.authScreen
  
    return (
      <React.Fragment>
        <div className="info">Please log in or register.</div>
        <div className="buttons">
          <div className="login" 
            onClick={() => updateAuthScreen('login')} >login</div>
          <div className="register"
            onClick={() => updateAuthScreen('register')} >register</div>
        </div>
      </React.Fragment>
    )
  }

  renderSidebarOptions = () => {
    
    const {screen} = this.props
    const [selectedScreen, updateScreen] = screen
    return (
      <div className="sidebar--options">
        <div className="options">
          <div className={`option ${selectedScreen === 'discover' ? 'selected' : ''}`}
            onClick={() => updateScreen('discover')} >Discover</div>
          <div className={`option ${selectedScreen === 'music' ? 'selected' : ''}`}
            onClick={() => updateScreen('music')} >Liked Music</div>
          <div className={`option ${selectedScreen === 'playlist' ? 'selected' : ''}`}
            onClick={() => updateScreen('playlist')} >Playlists</div>
          <div className={`option ${selectedScreen === 'search' ? 'selected' : ''}`}
            onClick={() => updateScreen('search')} >Search</div>
        </div>
      </div>
    )
  }

  render() {

    const {user} = this.props
    return (
      <div className='main--sidebar' >
        {
          !user ?
          this.renderLoginScreen()
          :
          this.renderSidebarOptions()
        }
      </div>
    )
  }
}
