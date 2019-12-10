
import React, { Component } from 'react'
import SVG from 'react-inlinesvg'

import FolderIcon from '../../assets/images/folder.svg'
import SpotifyIcon from '../../assets/images/spotify.svg'
import YoutubeIcon from '../../assets/images/youtube.svg'

export default class SideBar extends Component {

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
    const [musicProvider, updateMusicProvider] = this.props.musicProvider
    const [selectedScreen, updateScreen] = screen
    const spotifyClass = 'spotify' + (musicProvider !== 'spotify' ? ' disabled' : '')
    const youtubeClass = 'youtube' + (musicProvider !== 'youtube' ? ' disabled' : '')
    const deviceClass = 'device' + (musicProvider !== 'device' ? ' disabled' : '')
    return (
      <div className="sidebar--options">
        <div className="music-providers">
          <SVG src={SpotifyIcon} className={spotifyClass}
            onClick={() => updateMusicProvider('spotify', true)} />
          <SVG src={YoutubeIcon} className={youtubeClass}
            onClick={() => updateMusicProvider('youtube', true)} />
          <SVG src={FolderIcon} className={deviceClass}
            onClick={() => updateMusicProvider('device', true)} />
        </div>
        <div className="options">
          <div className={`option ${selectedScreen === 'music' ? 'selected' : ''}`}
            onClick={() => updateScreen('music')} >Liked Music</div>
          <div className={`option ${selectedScreen === 'search' ? 'selected' : ''}`}
            onClick={() => updateScreen('search')} >Search</div>
          { musicProvider === 'device' &&
            <div className={`option ${selectedScreen === 'device' ? 'selected' : ''}`}
              onClick={() => updateScreen('device')} >Local Music</div> }
        </div>
      </div>
    )
  }

  render() {

    const {user} = this.props
    return (
      <div className='main--sidebar' >
        {
          !user
          ? this.renderLoginScreen()
          : this.renderSidebarOptions()
        }
      </div>
    )
  }
}
