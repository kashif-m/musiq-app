
import React, { Component } from 'react'

export default class SideBar extends Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedOption: 'discover'
    }
  }

  renderLoginScreen = () => (
    <React.Fragment>
      <div className="info">Please log in or register.</div>
      <div className="buttons">
        <div className="login">login</div>
        <div className="register">register</div>
      </div>
    </React.Fragment>
  )

  renderSidebarOptions = () => (
    <div className="sidebar--options">
      <div className="options">
        <div className={`option ${this.state.selectedOption === 'discover' ? 'selected' : ''}`}
          onClick={() => this.setState({selectedOption: 'discover'})}
         >Discover</div>
        <div className={`option ${this.state.selectedOption === 'music' ? 'selected' : ''}`}
          onClick={() => this.setState({selectedOption: 'music'})}
         >Liked Music</div>
        <div className={`option ${this.state.selectedOption === 'playlist' ? 'selected' : ''}`}
          onClick={() => this.setState({selectedOption: 'playlist'})}
         >Saved Playlists</div>
      </div>
    </div>
  )

  render() {

    const {user} = this.props

    return (
      <div className='main--sidebar' >
        {
          user ?
          this.renderLoginScreen()
          :
          this.renderSidebarOptions()
        }
      </div>
    )
  }
}
