
import React from 'react'

export default props => {

  const {user} = props

  const renderSearch = () => (
    <div className="header--search">
      <input type="text" placeholder='Search for songs...' />
      <img src="" alt="search"/>
    </div>
  )

  return (
    <div className="header">
      <div className="logo">musiq</div>
      {
        user && <div className="img">IMAGE BRO</div>
      }
    </div>
  )
}
