
import React from 'react'
import axios from 'axios'

const youtubeAPI = require('../config/keys').youtubeAPI

export default props => {

  const {user} = props
  const [search, updateSearch] = props.search
  let seachQuery = {}

  const renderSearch = () => (
    <div className="search-box">
      <input type="text" placeholder='Search for songs...'
        ref={node => seachQuery = node} />
      <img src="" alt="search"
        onClick={() => querySearch()} />
    </div>
  )

  const renderUserBox = () => (
    <div className="user-box">
      <img src={require('../assets/images/avatar.svg')} alt="img"/>
      <div className="username">{user.username}</div>
    </div>
  )

  const querySearch = () => {

    const query = encodeURI(seachQuery.value)
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${youtubeAPI}&type=video&q=${query}`)
      .then(res => updateSearch(res.data))
      .catch(err => console.log(err.response))
  }

  return (
    <div className="header">
      <div className="logo">musiq</div>
      {renderSearch()}
      { user && renderUserBox() }
    </div>
  )
}
