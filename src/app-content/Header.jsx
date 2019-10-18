
import React from 'react'

export default props => {

  const {user} = props

  const renderSearch = () => (
    <div className="header--search">
      <input type="text" placeholder='Search for songs...' />
      <img src="" alt="search"/>
    </div>
  )

  const renderUserBox = () => (
    <div className="user-box">
      <img src={require('../assets/images/avatar.svg')} alt="img"/>
      <div className="username">{user.username}</div>
    </div>
  )

  return (
    <div className="header">
      <div className="logo">musiq</div>
      {
        user && renderUserBox()
      }
    </div>
  )
}
