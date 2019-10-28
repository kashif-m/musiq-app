
import React, { Component } from 'react'
import axios from 'axios'
import YTPlayer from 'yt-player'
import SVG from 'react-inlinesvg'

import PlayIcon from '../assets/images/play.svg'
import PauseIcon from '../assets/images/pause.svg'
import PreviousIcon from '../assets/images/previous.svg'
import NextIcon from '../assets/images/next.svg'
import CloseIcon from '../assets/images/close.svg'
import SaveIcon from '../assets/images/plus.svg'
import UpArrowIcon from '../assets/images/up-arrow.svg'

export default class Player extends Component {

  constructor(props) {
    super(props)

    const {playingNow} = this.props
    this.state = {
      fullscreen: false,
      title: '',
      trackOptions: {
        playing: false,
        duration: 0,
        paused: false,
        currentTime: 0
      }
    }
    this.player = false
  }

  componentDidMount() {

    this.checkTitle()
    if(this.props.musicProvider === 'youtube') {
      const opts = {
        width: 0,
        height: 0
      }
      this.player = new YTPlayer('#music-player', opts)
      this.playYoutube(this.props.playingNow.id.videoId)
    }
  }

  componentDidUpdate(prevProps, prevState) {

    const playingNowChanged = JSON.stringify(prevProps.playingNow) !== JSON.stringify(this.props.playingNow)
    if(playingNowChanged)
      this.play()

    if(prevState.fullscreen !== this.state.fullscreen
        || playingNowChanged)
      this.checkTitle()
  }

  shouldComponentUpdate(nextProps, nextState) {

    if(nextProps.musicProvider !== this.props.musicProvider) {
      if(nextProps.musicProvider === 'youtube') {
        this.player = new YTPlayer('#music-player')
      } else {
        this.player.destroy()
        this.player = false
      }
      return false
    }

    return true
  }

  getMinutes = seconds => {

    const minutes = parseInt(seconds / 60)
    const sec = parseInt(seconds % 60)
    return minutes === 0 ? `${sec}s`
      : sec === 0 ? `${minutes}m`
      : `${minutes}:${sec}`
  }

  checkTitle = () => {

    const {playingNow, musicProvider} = this.props
    const title = musicProvider === 'spotify' ? playingNow.name : playingNow.snippet.title
    if(title.length > 20 && !this.state.fullscreen)
      this.setState({title: title.slice(0, 20) + ' ...'})
    else
      this.setState({title})
  }

  playSpotify = uri => {

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

  playYoutube = videoID => {

    this.player.load(videoID)
    this.player.setVolume(100)
    this.player.play()
    this.player.on('playing', () => {
      const trackOptions = {...this.state.trackOptions}
      trackOptions.playing = true
      trackOptions.duration = this.player.getDuration()
      this.setState({trackOptions})
      window.setInterval(() => {
        const trackOptions = {...this.state.trackOptions}
        trackOptions.currentTime = this.player.getCurrentTime()
        this.setState({trackOptions})
      }, 1000)
    })
  }

  play = () => {

    const {musicProvider, playingNow} = this.props
    console.log('un play')
    console.log(playingNow)
    if(musicProvider === 'spotify')
      console.log('play-spotify')
    else
      this.playYoutube(playingNow.id.videoId)
  }

  renderPlayer = () => {

    const {playingNow, musicProvider} = this.props
    const {trackOptions} = this.state

    return (
      <div className="music-player">
        <div className="play-options">
          <SVG src={PreviousIcon} className='prev-song' />
          {
            trackOptions.playing
            ? <SVG src={PauseIcon} className='pause-song'
              onClick={() => {
                const trackOptions = {...this.state.trackOptions}
                trackOptions.playing = false
                trackOptions.paused = true
                this.setState({trackOptions})
                this.player.pause()
              }} />
            : <SVG src={PlayIcon} className='play-song' onClick={() => this.player.play()} />
          }
          <SVG src={NextIcon} className='next-song' />
        </div>
        <div className="seeker"></div>
        <div className="duration">
          <div className="elapsed">{this.getMinutes(trackOptions.currentTime)}</div> /
          <div className="total">{this.getMinutes(trackOptions.duration)}</div>
        </div>
        <div id="music-player"></div>
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
          fullscreen && <SVG src={CloseIcon} className='close'
            onClick={() => this.setState({fullscreen: false})} />
        }
        {
          musicProvider === 'spotify'
          ? this.renderSpotifyDetails()
          : this.renderYoutubeDetails()
        }
        <div className="song-options">
          <SVG src={SaveIcon} className='save' />
          {
            !fullscreen ?
            <SVG src={UpArrowIcon}
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

