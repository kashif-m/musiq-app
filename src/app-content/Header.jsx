
import React from 'react'
import SVG from 'react-inlinesvg'
import Avatar from '../assets/images/avatar.svg'

export default props => {

  const {user} = props

  const renderUserBox = () => (
    <div className="user-box">
      <SVG src={Avatar} height={40} />
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
