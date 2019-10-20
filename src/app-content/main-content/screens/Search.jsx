
import React, {useState, useEffect} from 'react'
import axios from 'axios'

const youtubeAPI = require('../../../config/keys').youtubeAPI
const spotifyToken = require('../../../config/keys').spotifyToken

export default () => {

  const [searchParams, setSearchParams] = useState({
    type: ['album', 'track', 'artist'],
    limit: 5
  })
  const [searchResults, setSearchResults] = useState(false)
  let seachQuery = {}

  useEffect(() => {

    const items = localStorage.getItem('items')
    setSearchResults(JSON.parse(items))
  }, [])

  const querySearch = () => {

    const {limit, type} = searchParams
    const query = encodeURI(seachQuery.value)
    axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type.join(',')}&limit=${limit}`,
      { headers: { Authorization: spotifyToken } })
      .then(res => setSearchResults(res.data))
      .catch(err => console.log(err.response))
  }

  const renderSearch = () => (
    <div className="search-box">
      <input type="text" placeholder='Search for songs...'
        ref={node => seachQuery = node}
        onKeyPress={key => key.charCode === 13 ? querySearch() : null} />
      <img src={require('../../../assets/images/search.svg')} alt="search"
        onClick={() => querySearch()} />
    </div>
  )

  const renderTracks = tracks => {
    
    const {items} = tracks

    return (
      <div className="tracks">
        <div className="heading">Tracks</div>
        {
          items.map(item => {
            const {artists, name, id, album} = item
            const {images} = album
            console.log(images)
            return (
              <div className="track" key={id} >
                <img src={images.length > 0 ? images[2].url : null} alt="ti"/>
                <div className="title">{name}</div>
                <div className="artist">{artists[0].name}</div>
              </div>
            )
          })
        }
      </div>
    )
  }

  const renderArtists = artists => {

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

  const renderAlbums = albums => {

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

  const renderSearchResults = () => {

    let {albums, artists, tracks} = searchResults
    localStorage.setItem('items', JSON.stringify(searchResults))

    return (
      <div className="search-results">
        {renderTracks(tracks)}
        {renderAlbums(albums)}
        {renderArtists(artists)}
      </div>
    )
  }
  
  return (
    <div className="search">
      <div className="heading"> Search </div>
      {renderSearch()}
      {
        searchResults ?
        renderSearchResults() : null
      }
    </div>
  )
}
