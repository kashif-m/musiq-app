
import React, { Component } from 'react'
import axios from 'axios'
import YTPlayer from 'yt-player'
import SVG from 'react-inlinesvg'

import PlayIcon from '../assets/images/play.svg'
import PauseIcon from '../assets/images/pause.svg'
import PreviousIcon from '../assets/images/previous.svg'
import NextIcon from '../assets/images/next.svg'
import CloseIcon from '../assets/images/close.svg'
import SaveIcon from '../assets/images/save.svg'
import FullScreenIcon from '../assets/images/fullscreen.svg'

export default class Player extends Component {

  constructor(props) {
    super(props)

    this.state = {
      fullscreen: false,
      title: this.checkTitle(true),
      trackOptions: {
        playing: false,
        duration: 0,
        paused: false,
        currentTime: 0
      }
    }
    this.YTplayer = false
    this.LocalPlayer = false
  }

  componentDidMount() {

    if(this.props.musicProvider === 'youtube') {
      const opts = {
        width: 0,
        height: 0
      }
      this.YTplayer = new YTPlayer('#music-player', opts)
      this.playYoutube(this.props.playingNow.id.videoId)
    } else if(this.props.musicProvider === 'device') {
      this.LocalPlayer = new Audio()
      this.playLocalMusic()
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if(prevProps.playingNow.from !== this.props.playingNow.from) {
      if(prevProps.playingNow.from === 'youtube' && this.props.playingNow.from === 'device') {
        this.destroyYT()
        this.LocalPlayer = new Audio()
      } else if(prevProps.playingNow.from === 'device' && this.props.playingNow.from === 'youtube') {
        this.destroyLocal()
        this.YTplayer = new YTPlayer('#music-player')
      }
    }

    const playingNowChanged = JSON.stringify(prevProps.playingNow) !== JSON.stringify(this.props.playingNow)
    if(playingNowChanged)
      this.load()

    if(prevState.fullscreen !== this.state.fullscreen
        || playingNowChanged)
      this.checkTitle()
  }

  destroyYT = () => {
    this.YTplayer.destroy()
    this.YTplayer = false
  }

  destroyLocal = () => {
    this.LocalPlayer.src = false
    this.LocalPlayer.load()
    this.LocalPlayer = false
  }

  getMinutes = seconds => {

    if(!seconds)
      return '..'
    const minutes = parseInt(seconds / 60)
    const sec = parseInt(seconds % 60)
    return minutes === 0 ? `${sec}s`
      : sec === 0 ? `${minutes}m`
      : `${minutes}m ${sec}s`
  }

  checkTitle = (onLoad = false) => {

    const {playingNow} = this.props
    const f = onLoad ? true : !this.state.fullscreen
    let title = playingNow.from === 'spotify' ? playingNow.name
        : playingNow.from === 'youtube' ? playingNow.snippet.title
        : playingNow.from === 'device' ? playingNow.common.title : ''
    if(title.length > 20 && f)
      title = title.slice(0, 20) + ' ...'
    if(!onLoad)
      this.setState({title})
    return title
  }

  playSpotify = uri => {

    if(this.YTplayer) {
      const data = {
        context_uri: uri,
      }
      const {user} = this.props
      const token = 'Bearer ' + user.spotify.access_token
      axios.put('https://api.spotify.com/v1/me/player/play', data, {
        headers: {
          Authorization: token
        }})
        .then(res => console.log(res.data))
        .catch(err => console.log(err.response.data))
    }
  }

  playYoutube = videoID => {

    this.YTplayer.load(videoID)
    this.YTplayer.setVolume(100)
    this.YTplayer.play()

    this.YTplayer.on('playing', () => {

      const trackOptions = {...this.state.trackOptions}
      trackOptions.playing = true
      trackOptions.duration = this.YTplayer.getDuration()
      this.setState({trackOptions})
    })

    this.YTplayer.on('timeupdate', seconds => {

      const trackOptions = {...this.state.trackOptions}
      trackOptions.currentTime = seconds
      this.setState({trackOptions})
    })

    this.YTplayer.on('ended', () => {

      const trackOptions = {...this.state.trackOptions}
      const [queue, updateQueue] = this.props.queue

      if(!queue.playing) {

        trackOptions.playing = false
        this.setState({trackOptions})
      } else {

        const temp = {...queue}

        if(temp.current < temp.songs.length - 1)
          this.changeSong(1)

        else {

          temp.playing = false
          updateQueue(temp)
          trackOptions.playing = false
          this.setState({trackOptions})  
        }
      }
    })
  }

  playLocalMusic = () => {

    const {path, common} = this.props.playingNow
    this.LocalPlayer.src = path
    this.LocalPlayer.preload = "metadata"

    this.LocalPlayer.onloadedmetadata = () => {

      const trackOptions = {...this.state.trackOptions}
      trackOptions.playing = true
      trackOptions.duration = this.LocalPlayer.duration
      this.setState({trackOptions})
      this.LocalPlayer.play()
    }

    this.LocalPlayer.ontimeupdate = () => {

      const trackOptions = {...this.state.trackOptions}
      trackOptions.currentTime = this.LocalPlayer.currentTime
      this.setState({trackOptions})
    }
  }

  load = () => {

    const {playingNow} = this.props
    if(playingNow.from === 'spotify')
      console.log('play-spotify')
    else if(playingNow.from === 'youtube')
      this.playYoutube(playingNow.id.videoId)
    else if(playingNow.from === 'device')
      this.playLocalMusic()
  }

  resume = () => {

    const {playingNow} = this.props
    if(playingNow.from === 'youtube')
      this.YTplayer.play()
    else if(playingNow.from === 'device')
      this.LocalPlayer.play()

    const trackOptions = {...this.state.trackOptions}
    trackOptions.playing = true
    trackOptions.paused = false
    this.setState({trackOptions})
  }

  pause = () => {
    
    const {playingNow} = this.props

    if(playingNow.from === 'youtube')
      this.YTplayer.pause()
    else if(playingNow.from === 'device')
      this.LocalPlayer.pause()

    const trackOptions = {...this.state.trackOptions}
    trackOptions.playing = false
    trackOptions.paused = true
    this.setState({trackOptions})
  }

  changeSong = val => {
    
    const {updatePlayingNow, musicProvider, updateMusicProvider} = this.props
    const [queue, updateQueue] = this.props.queue
    const temp = {...queue}

    if(temp.current + val < temp.songs.length && temp.current + val > 0) {

      temp.current += val
      if(temp.from !== musicProvider)
        updateMusicProvider(temp.songs[temp.current].from)
      updateQueue(temp)
      updatePlayingNow(temp.songs[temp.current], false)
    }
  }

  saveSong = () => {

    const {user, playingNow, updateUser} = this.props

    let song = false
    if(playingNow.from === 'device')
      song = playingNow.path
    else song = playingNow

    const data = {
      musicProvider: playingNow.from,
      songDetails: song
    }

    axios.post('http://localhost:5000/user-data/like', data, {headers: {Authorization: user.token}})
      .then(res => {
        const temp = {...user}
        temp.likedSongs = res.data.length === 0 ? false
        : res.data.sort((a, b) => {
            return new Date(a.savedOn) - new Date(b.savedOn)
          }).reverse()
        updateUser(temp)
      })
      .catch(err => console.log(err.response))
  }

  seek = event => {
    
    const {trackOptions} = this.state
    const {playingNow} = this.props
    let start, end
    if(this.state.fullscreen)
      start = 20
    else {
      const trackWidth = document.getElementById('track-cover').clientWidth
      const detailsWidth = document.querySelector('.song-details').clientWidth + 40
      start = trackWidth + detailsWidth + 20
    }
    let clientWidth = document.getElementById('seeker').clientWidth
    end = clientWidth + start
    const perc = this.mapValue(event.clientX, start, end, 0, 100)

    if(playingNow.from === 'youtube')
      this.YTplayer.seek(perc * trackOptions.duration / 100)
    else if(playingNow.from === 'device')
      this.LocalPlayer.currentTime = perc * trackOptions.duration / 100
  }

  renderPlayer = () => {

    const [queue, updateQueue] = this.props.queue
    const {trackOptions} = this.state
    return (
      <div className="music-player">
        <div className="play-options">
          <SVG src={PreviousIcon} className='prev-song'
            onClick={() => queue.playing ? this.changeSong(-1) : null} />
          {
            trackOptions.playing ?
            <SVG src={PauseIcon} className='pause-song'
              onClick={() => this.pause()} />
            : <SVG src={PlayIcon} className='play-song'
              onClick={() => this.resume()} />
          }
          <SVG src={NextIcon} className='next-song'
            onClick={() => queue.playing ? this.changeSong(1) : null} />
        </div>
        <div className="seeker" id='seeker'
          onClick={event => this.seek(event)} >
            <div className="tracker"
              style={
                this.YTplayer ?
                { width: `${this.mapValue(this.YTplayer.getCurrentTime(), 0, trackOptions.duration, 0, 100)}%` }
                : this.LocalPlayer ?
                { width: `${this.mapValue(this.LocalPlayer.currentTime, 0, trackOptions.duration, 0, 100)}%` }
                : {}
              } ></div>
        </div>
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
        <img className='track-cover' alt='' id='track-cover'
          src={this.state.fullscreen ? playingNow.album.images[0].url : playingNow.album.images[1].url} />
        <div className="song-details" id='song-details' >
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
        <img alt="" className="track-cover" id='track-cover'
          src={this.state.fullscreen ? thumbnails.high.url : thumbnails.medium.url} />
        <div className="song-details" id='song-details' >
          <div className="title">{this.state.title}</div>
          <div className="artist">{channelTitle}</div>
        </div>
      </React.Fragment>
    )
  }

  renderLocalMusicDetails = () => {

    const song = this.props.playingNow
    const {picture, artist} = song.common
    return (
      <React.Fragment>
        <img src={picture && picture[0].url} alt=""
          className="track-cover" id="track-cover"/>
        <div className="song-details" id="song-deatils">
          <div className="title">{this.state.title}</div>
          <div className="artist">{artist}</div>
        </div>
      </React.Fragment>
    )
  }

  isSaved = () => {

    const {playingNow} = this.props
    const {likedSongs} = this.props.user
    if(playingNow.from === 'youtube') {

      const {etag} = playingNow
      return likedSongs && likedSongs.filter(song => song.song.data.etag === etag).length === 1
    } else if(playingNow.from === 'device') {

      const {path} = playingNow
      return likedSongs && likedSongs.filter(song => song.song.data.path === path).length === 1
    }
  }

  renderButtons = () => {

    const saved = this.isSaved()
    return (
      <div className="fullscreen-buttons">
        <SVG src={CloseIcon} className='close'
          onClick={() => this.setState({fullscreen: false})} />
        {
          this.props.user &&
          <div className={`${saved ? 'remove' : 'save'} button`}
            onClick={() => this.saveSong()} >
            {
              saved ? 'Remove' : '+ Save'
            }
          </div>
        }
        </div>
    )
  }

  renderSongOptions = () => (
    <div className="song-options">
      {
        this.props.user &&
        <SVG src={SaveIcon} className={`save${this.isSaved() ? ' saved' : ''}`}
          onClick={() => this.saveSong()} />
      }
      <SVG src={FullScreenIcon}
        className='fullscreen'
        onClick={() => this.setState({fullscreen: !this.state.fullscreen})} />
    </div>
  )

  mapValue = (value, fromLow, fromHigh, toLow, toHigh) => (toLow + (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow))

  render() {

    const {fullscreen} = this.state
    const {playingNow} = this.props
    return (
      <div className={`player${fullscreen ? ' fullscreen' : ''}`} >
        { fullscreen ? this.renderButtons() : this.renderSongOptions() }
        {
          playingNow.from === 'spotify' ? this.renderSpotifyDetails()
          : playingNow.from === 'youtube' ? this.renderYoutubeDetails()
          : playingNow.from === 'device' ? this.renderLocalMusicDetails()
          : null
        }
        {this.renderPlayer()}
      </div>
    )
  }
}
