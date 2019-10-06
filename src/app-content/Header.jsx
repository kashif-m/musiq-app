
import React from 'react'

export default props => {

  const renderSearch = () => (
    <div className="header--search">
      <input type="text" placeholder='Search for songs...' />
      <img src="" alt="search"/>
    </div>
  )

  return (
    <div className="header">
      <div className="logo">Musiq</div>
      <div className="header--account">
        <img src="" alt="acc"/>
      </div>
    </div>
  )
}
