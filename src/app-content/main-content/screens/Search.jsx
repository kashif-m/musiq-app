
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default props => {
  
  const {user} = props
  const [searchParams, setSearchParams] = useState({
    type: ['album', 'track', 'artist'],
    limit: 5
  })
  const [searchResults, setSearchResults] = props.searchResults
  let seachQuery = {}

  const [playingNow, updatePlayingNow] = props.playingNow

  const querySearch = () => {

    console.log(user)
    if(!user)
      return

    const {spotify} = user
    const access_token = 'Bearer ' + spotify.access_token
    console.log(access_token)
    const {limit, type} = searchParams
    const query = encodeURI(seachQuery.value)
    axios.get(`https://api.spotify.com/v1/search?q=${query}&type=${type.join(',')}&limit=${limit}`,
      { headers: { Authorization: access_token } })
      .then(res => {
        console.log(res.data)
        Object.keys(res.data).length > 0
        ? setSearchResults(res.data)
        : setSearchResults(false)
      })
      .catch(err => console.log(err.response))
  }

  const renderSearch = () => (
    <div className="search-box">
      <input type="text" placeholder='Search ...'
        ref={node => seachQuery = node}
        defaultValue={searchResults ? 
          new URL(searchResults[Object.keys(searchResults)[0]].href).searchParams.get('query') : null}
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
            console.log(item)
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
        {tracks.items.length > 0 && renderTracks(tracks)}
        {albums.items.length > 0 && renderAlbums(albums)}
        {artists.items.length > 0 && renderArtists(artists)}
      </div>
    )
  }
  
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
