
import React from 'react'
import axios from 'axios'

export default props => {

  const {user} = props

  const renderUserBox = () => (
    <div className="user-box">
      <img src={require('../assets/images/avatar.svg')} alt="img"/>
      <div className="username">{user.username}</div>
    </div>
  )

  return (
    <div className="header">
      <div className="logo">musiq</div>
      { user && renderUserBox() }
    </div>
  )
}
