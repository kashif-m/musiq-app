
import React, {useState, useEffect} from 'react'
import SVG from 'react-inlinesvg'
import axios from 'axios'

import SearchIcon from '../../../assets/images/search.svg'

import {youtubeAPI} from '../../../config/keys'

export default props => {
  
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

    if(musicProvider === 'spotify')
      spotifySearch()
    else
      youtubeSearch()
  }

  const youtubeSearch = () => {

    const query = encodeURI(seachQuery.value)
    const type = 'video'
    const regionCode = 'US'
    const videoLicense = 'youtube'
    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${youtubeAPI}&part=snippet&q=${query}&type=${type}&videoLicense=${videoLicense}&regionCode=${regionCode}`)
      .then(res => updateSearchResults(res.data))
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
      })
      .catch(err => console.log(err.response))
  }

  const renderSearch = () => (
    <div className="search-box">
      <input type="text" placeholder='Search ...'
        ref={node => seachQuery = node}
        // defaultValue={searchResults ?
          // new URL(searchResults[Object.keys(searchResults)[0]].href).searchParams.get('query') : null}
        onKeyPress={key => key.charCode === 13 ? querySearch() : null} />
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
            return (
              <div className="track" key={id} >
                <img src={images.length > 0 ? images[2].url : null} alt="ti"
                  onClick={() => updatePlayingNow(item)} />
                <div className="title"
                  onClick={() => updatePlayingNow(item)} >{name}</div>
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
            return (
              <div className="track" key={item.etag} >
                <img src={thumbnails.medium.url} alt="i"
                  onClick={() => updatePlayingNow(item)} />
                <div className="title"
                  onClick={() => updatePlayingNow(item)} >{title}</div>
                <div className="artist">{channelTitle}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderSearchResults = () => (
    <div className="search-results">
      {musicProvider === 'spotify' ? renderSpotifySearchResults() : renderYoutubeSearchResults()}
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
        searchResults ?
        renderSearchResults() : null
      }
    </div>
  )
}
