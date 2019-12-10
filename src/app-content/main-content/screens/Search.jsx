
import React, {useState, useEffect} from 'react'
import SVG from 'react-inlinesvg'
import axios from 'axios'

import DefaultCover from '../../../assets/images/defaultcover.svg'
import SearchIcon from '../../../assets/images/search.svg'

import {youtubeAPI} from '../../../config/keys'

export default props => {
  
  const [info, updateInfo] = useState('Searching ...')
  const [wait, updateWait] = useState(false)
  const {user, musicProvider} = props
  const [searchParams, setSearchParams] = useState({
    type: ['album', 'track', 'artist'],
    limit: 5
  })
  const [searchResults, updateSearchResults] = props.searchResults
  let seachQuery = {}

  const [playingNow, updatePlayingNow] = props.playingNow

  const querySearch = () => {

    if(!user)
      return

    updateWait(true)
    if(musicProvider === 'spotify')
      spotifySearch()
    else if(musicProvider === 'youtube')
      youtubeSearch()
    else if(musicProvider === 'device')
      deviceSearch()
  }

  useEffect(() => {

    if(props.metadata && musicProvider === 'device') {
      info === 'Searching ...' && updateInfo('Search complete.')
      setTimeout(() => info !== 'Search complete.' && updateInfo(false), 2000)
    } else if(musicProvider !== 'device' && info.length !== 0)
      updateInfo(false)
  }, [props.metadata, musicProvider])

  const youtubeSearch = () => {

    const query = encodeURI(seachQuery.value)
    const type = 'video'
    const regionCode = 'US'
    const videoLicense = 'youtube'
    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${youtubeAPI}&part=snippet&q=${query}&type=${type}&videoLicense=${videoLicense}&regionCode=${regionCode}`)
      .then(res => {
        updateSearchResults(res.data)
        updateWait(false)
      })
      .catch(err => updateSearchResults(false))
  }

  const spotifySearch = () => {

    const {spotify} = user
    const access_token = 'Bearer ' + spotify.access_token
    const {limit, type} = searchParams
    const query = encodeURI(seachQuery.value)
    axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type.join(',')}&limit=${limit}`,
      { headers: { Authorization: access_token } })
      .then(res => {
        console.log(res.data)
        Object.keys(res.data).length > 0
        ? updateSearchResults(res.data)
        : updateSearchResults(false)
        updateWait(false)
      })
      .catch(err => console.log(err.response))
  }

  const deviceSearch = () => {

    const searchQuery = seachQuery.value.toLowerCase()
    console.log(searchQuery)
    if(seachQuery.length === 0)
      updateInfo('Enter search value.')
    const {metadata} = props
    const searchResults = metadata.filter(file => file.common.title.toLowerCase().includes(searchQuery))
    if(searchResults.length === 0) {
      updateSearchResults(false)
      updateInfo('No results found.')
    }
    else
      updateSearchResults(searchResults)
    updateWait(false)
  }

  const renderSearch = () => (
    <div className="search-box">
      <input type="text" placeholder={'Search ' +
                (musicProvider === 'youtube' ? 'on YouTube'
                : musicProvider === 'spotify' ? 'on Spotify'
                : musicProvider === 'device' ? 'music on device'
                : null) + ' ... '}
        ref={node => seachQuery = node}
        autoFocus
        // defaultValue={searchResults ?
          // new URL(searchResults[Object.keys(searchResults)[0]].href).searchParams.get('query') : null}
        onKeyPress={key => key.charCode === 13 && info !== 'Searching ...' && !wait ? querySearch() : null} />
      <SVG src={SearchIcon} onClick={() => querySearch()} />
    </div>
  )

  const renderSpotifyTracks = tracks => {
    
    const {items} = tracks

    return (
      <div className="tracks">
        <div className="heading">Tracks</div>
        {
          items.map(item => {
            const {artists, name, id, album} = item
            const {images} = album
            const itemTemp = {...item}
            itemTemp.from = 'spotify'
            return (
              <div className="track" key={id} >
                <img src={images.length > 0 ? images[2].url : null} alt="ti"
                  onClick={() => updatePlayingNow(itemTemp, true)} />
                <div className="title"
                  onClick={() => updatePlayingNow(itemTemp, true)} >{name}</div>
                <div className="artist">{artists[0].name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderSpotifyArtists = artists => {

    const {items} = artists

    return (
      <div className="artists">
        <div className="heading">Artists</div>
        {
          items.map(item => {
            const {images, name, id} = item
            return (
              <div className="artist" key={id} >
                <img src={images.length > 0 ? images[2].url : null} alt="ai"/>
                <div className="title">{name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderSpotifyAlbums = albums => {

    const {items} = albums
    
    return (
      <div className="albums">
        <div className="heading">Albums</div>
        {
          items.map(item => {
            const {name, id, artists, images} = item
            return (
              <div className="album" key={id} >
                <img src={images.length > 0 ? images[2].url : null} alt="ali"/>
                <div className="title">{name}</div>
                <div className="artist">{artists[0].name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderSpotifySearchResults = () => {

    let {albums, artists, tracks} = searchResults

    return (
      <React.Fragment>
        {tracks.items.length > 0 && renderSpotifyTracks(tracks)}
        {albums.items.length > 0 && renderSpotifyAlbums(albums)}
        {artists.items.length > 0 && renderSpotifyArtists(artists)}
      </React.Fragment>
    )
  }

  const renderYoutubeSearchResults = () => {
    
    let {items} = searchResults
    return (
      <div className="tracks">
        {
          items.map(item => {
            const {snippet} = item
            const {channelTitle, title, thumbnails} = snippet
            const itemTemp = {...item}
            itemTemp.from = 'youtube'
            return (
              <div className="track" key={item.etag} >
                <img src={thumbnails.medium.url} alt="i"
                  onClick={() => updatePlayingNow(itemTemp, true)} />
                <div className="title"
                  onClick={() => updatePlayingNow(itemTemp, true)} >{title}</div>
                <div className="artist">{channelTitle}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderDeviceSearchResults = () => {

    return (
      <div className="tracks">
        {
          searchResults.length === 0 ? <div className="empty">No results found.</div>
          : <div className="track-list">
            {
              searchResults.map(song => {
					
                const {artist, title, picture} = song.common
                const url = picture ? picture[0].url : false
                const songTemp = {...song}
                songTemp.from = 'device'
                return (
                  <div className="track" key={song.path} >
                    {
                      url ?
                      <img src={url} alt="i" className='cover'
                        onClick={() => updatePlayingNow(songTemp, true)} />
                      : <SVG src={DefaultCover} className='cover'
                          onClick={() => updatePlayingNow(songTemp, true)} />
                    }
                    <div className="title"
                      onClick={() => updatePlayingNow(songTemp, true)} >{title}</div>
                    <div className="artist">{artist}</div>
                    <div className="album"></div>
                  </div>)
              })
            }
          </div>
        }
      </div>
    )
  }

  const renderSearchResults = () => (
    <div className="search-results">
      {
        musicProvider === 'spotify' ?
        renderSpotifySearchResults()
        : musicProvider === 'youtube' ?
        renderYoutubeSearchResults()
        : musicProvider === 'device' ?
        renderDeviceSearchResults()
        : null
      }
    </div>
  )

  const renderSearchInfo = () => (
    <div className="search-info">
      {wait && <div className="loading">Loading ...</div>}
      {info && <div className="info">{info}</div> }
    </div>
  )
  
  return (
    <div className="search">
      <div className="heading">
        {
          searchResults ? 'Search Results' : 'Search'
        }
      </div>
      {renderSearch()}
      {
        searchResults
        ? renderSearchResults()
        : renderSearchInfo()
      }
    </div>
  )
}
