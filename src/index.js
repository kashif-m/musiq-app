
import '@babel/polyfill'
import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'

import App from './App.jsx'
import './styles/style.sass'

render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('react-app')
)
