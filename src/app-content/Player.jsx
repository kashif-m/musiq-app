
import React, { Component } from 'react'
import axios from 'axios'

export default class Player extends Component {

  constructor(props) {
    super(props)

    const {playingNow} = this.props
    this.state = {
      fullscreen: false,
      title: ''
    }
    this.player = false
  }

  componentDidMount() {
    this.checkTitle()
  }

  componentDidUpdate(prevProps, prevState) {

    if(JSON.stringify(prevProps.playingNow) !== JSON.stringify(this.props.playingNow)
        || prevState.fullscreen !== this.state.fullscreen ) {
      this.checkTitle()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(nextProps.musicProvider !== this.props.musicProvider)
      return false

    return true
  }

  checkTitle = () => {

    
    const {playingNow, musicProvider} = this.props
    const title = musicProvider === 'spotify' ? playingNow.name : playingNow.snippet.title
    if(title.length > 20 && !this.state.fullscreen)
      this.setState({title: title.slice(0, 20) + ' ...'})
    else
      this.setState({title})  }

  play = uri => {

    console.log(uri)
    if(this.player) {
      const data = {
        context_uri: uri,
      }
      const {user} = this.props
      const token = 'Bearer ' + user.spotify.access_token
      console.log(token)
      axios.put('https://api.spotify.com/v1/me/player/play', data, {
        headers: {
          Authorization: token
        }})
        .then(res => console.log(res.data))
        .catch(err => console.log(err.response.data))
    }
  }

  renderPlayer = () => {

    return (
      <div className="music-player">
        <div className="play-options">
          <img className='prev-song' src={require('../assets/images/previous.svg')} alt="<"/>
          <img className='play-song' src={require('../assets/images/play.svg')} alt="D"
            onClick={() => this.play('spotify:track:4iV5W9uYEdYUVa79Axb7Rh')} />
          <img className='next-song' src={require('../assets/images/next.svg')} alt=">"/>
        </div>
        <div className="duration"></div>
      </div>
    )
  }

  renderSpotifyDetails = () => {

    const {playingNow} = this.props

    return (
      <React.Fragment>
        <img className='track-cover' alt=''
          src={this.state.fullscreen ? playingNow.album.images[0].url : playingNow.album.images[1].url} />
        <div className="song-details">
          <div className="title">{this.state.title}</div>
          <div className="artist">{playingNow.artists[0].name}</div>
        </div>
      </React.Fragment>
    )
  }

  renderYoutubeDetails = () => {

    const {snippet} = this.props.playingNow
    const {thumbnails, channelTitle} = snippet

    return (

      <React.Fragment>
        <img alt="" className="track-cover"
          src={this.state.fullscreen ? thumbnails.high.url : thumbnails.medium.url} />
        <div className="song-details">
          <div className="title">{this.state.title}</div>
          <div className="artist">{channelTitle}</div>
        </div>
      </React.Fragment>
    )
  }

  render() {

    const {fullscreen} = this.state
    const {musicProvider} = this.props

    return (
      <div className={`player${fullscreen ? ' fullscreen' : ''}`} >
        {
          fullscreen && <img className='close'
            src={require('../assets/images/close.svg')} alt="x"
            onClick={() => this.setState({fullscreen: false})} />
        }
        {
          musicProvider === 'spotify'
          ? this.renderSpotifyDetails()
          : this.renderYoutubeDetails()
        }
        <div className="song-options">
          <img src={require('../assets/images/plus.svg')} alt="+"
            className='save' />
          {
            !fullscreen ?
            <img src={require('../assets/images/up-arrow.svg')} alt="^"
              className='fullscreen'
              onClick={() => this.setState({fullscreen: !fullscreen})} />
            : null
          }
        </div>
        {this.renderPlayer()}
      </div>
    )
  }
}

