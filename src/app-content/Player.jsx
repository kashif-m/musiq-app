
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
    this.player = false
  }

  componentDidMount() {

    if(this.props.musicProvider === 'youtube') {
      const opts = {
        width: 0,
        height: 0
      }
      this.player = new YTPlayer('#music-player', opts)
      this.playYoutube(this.props.playingNow.id.videoId)
    } else if(this.props.musicProvider === 'device')
      this.playLocalMusic()
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

  checkTitle = (onLoad = false) => {

    const {playingNow, musicProvider} = this.props
    const f = onLoad ? true : !this.state.fullscreen
    let title = musicProvider === 'spotify' ? playingNow.name
        : musicProvider === 'youtube' ? playingNow.snippet.title
        : musicProvider === 'device' ? playingNow.common.title : ''
    if(title.length > 20 && f)
      title = title.slice(0, 20) + ' ...'
    if(!onLoad)
      this.setState({title})
    return title
  }

  playSpotify = uri => {

    console.log(uri)
    if(this.player) {
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

    this.player.load(videoID)
    this.player.setVolume(100)
    this.player.play()
    this.player.on('playing', () => {

      const trackOptions = {...this.state.trackOptions}
      trackOptions.playing = true
      trackOptions.duration = this.player.getDuration()
      this.setState({trackOptions})
    })

    this.player.on('timeupdate', seconds => {

      const trackOptions = {...this.state.trackOptions}
      trackOptions.currentTime = seconds
      this.setState({trackOptions})
    })

    this.player.on('ended', () => {

      const [queue, updateQueue] = this.props.queue

      if(!queue.playing) {

        const trackOptions = {...this.state.trackOptions}
        trackOptions.playing = false
        this.setState({trackOptions})
      } else {

        const temp = {...queue}

        if(temp.current < temp.songs.length - 1)
          this.changeSong(1)

        else {

          temp.playing = false
          updateQueue(temp)
          const trackOptions = {...this.state.trackOptions}
          trackOptions.playing = false
          this.setState({trackOptions})  
        }
      }
    })
  }

  playLocalMusic = () => {

    const {path, common} = this.props.playingNow
    console.log(path)
    var audio = new Audio()
    audio.src = path
    var playPromise = audio.play();
    if (playPromise !== undefined) {
          playPromise.then(function() {
             audio.addEventListener('timeupdate',function() {
                console.log(audio.currentTime, audio.duration);
             }, true);
          }).catch(function(error) {
                console.error('Failed to start your sound, retrying.');
          });
    }
  }

  play = () => {

    const {musicProvider, playingNow} = this.props
    if(musicProvider === 'spotify')
      console.log('play-spotify')
    else if(musicProvider === 'youtube') {
      this.player.load(playingNow.id.videoId)
      this.player.play()
    } else if(musicProvider === 'device')
      this.playLocalMusic()
  }

  changeSong = val => {
    
    const {updatePlayingNow} = this.props
    const [queue, updateQueue] = this.props.queue
    const temp = {...queue}

    if(temp.current + val < temp.songs.length && temp.current + val > 0) {

      temp.current += val
      updateQueue(temp)
      updatePlayingNow(temp.songs[temp.current])
    }
  }

  saveSong = () => {

    const {user, musicProvider, playingNow, updateUser} = this.props

    const data = {
      musicProvider,
      songDetails: playingNow
    }

    axios.post('http://localhost:5000/user-data/like', data, {headers: {Authorization: user.token}})
      .then(res => {
        const temp = {...user}
        temp.likedSongs = res.data
        updateUser(temp)
      })
      .catch(err => console.log(err.response))
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
              onClick={() => {
                const trackOptions = {...this.state.trackOptions}
                trackOptions.playing = false
                trackOptions.paused = true
                this.setState({trackOptions})
                this.player.pause()
              }} />
            : <SVG src={PlayIcon} className='play-song' onClick={() => this.player.play()} />
          }
          <SVG src={NextIcon} className='next-song'
            onClick={() => queue.playing ? this.changeSong(1) : null} />
        </div>
        <div className="seeker" id='seeker'
          onClick={(event) => {
            let start, end
            if(this.state.fullscreen)
              start = 20
            else {
              const trackWidth = document.getElementById('track-cover').clientWidth
              const detailsWidth = document.getElementById('song-details').clientWidth + 40
              start = trackWidth + detailsWidth + 20
            }
            let clientWidth = document.getElementById('seeker').clientWidth
            end = clientWidth + start
            const perc = this.mapValue(event.clientX, start, end, 0, 100)
            this.player.seek(perc * trackOptions.duration / 100)
          }} >
            <div className="tracker"
              style={
                this.player ?
                { width: `${this.mapValue(this.player.getCurrentTime(), 0, trackOptions.duration, 0, 100)}%` }
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

    const {etag} = this.props.playingNow
    const {likedSongs} = this.props.user
    
    return likedSongs && likedSongs.filter(song => song.data.etag === etag).length === 1
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
    const {musicProvider} = this.props

    return (
      <div className={`player${fullscreen ? ' fullscreen' : ''}`} >
        { fullscreen ? this.renderButtons() : this.renderSongOptions() }
        {
          musicProvider === 'spotify' ? this.renderSpotifyDetails()
          : musicProvider === 'youtube' ? this.renderYoutubeDetails()
          : musicProvider === 'device' ? this.renderLocalMusicDetails()
          : null
        }
        {this.renderPlayer()}
      </div>
    )
  }
}
