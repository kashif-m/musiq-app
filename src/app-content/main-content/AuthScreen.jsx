
import React, { Component } from 'react'
import SVG from 'react-inlinesvg'
import axios from 'axios'

import CancelIcon from '../../assets/images/cancel.svg'
import CloseIcon from '../../assets/images/close.svg'

export default class AuthScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      serverErr: false,
      serverCall: false
    }
  }

  componentDidMount() {

    const [user, updateUser] = this.props.user
    const [authScreen, updateAuthScreen] = this.props.authScreen

    if(user)
      updateAuthScreen(false)
  }

  componentDidUpdate(prevProps, prevState) {
    const [authScreen, updateAuthScreen] = this.props.authScreen
    const [prevAuthScreen] = prevProps.authScreen
    if(authScreen !== prevAuthScreen) {
      this.username.value = ''
      this.password.value = ''
    }
  }

  submit = requestType => {

    this.setState({serverCall: true})
    const {getSpotifyCode} = this.props
    const [authScreen, updateAuthScreen] = this.props.authScreen
  
    const newUser = {
      username: this.username.value,
      password: this.password.value
    }

    if(requestType === 'register')
      newUser.email = this.email.value

    if(requestType === 'register')
      axios.post('http://localhost:5000/user/new', {user: newUser})
        .then(res => {
          this.setState({serverCall: false})
          if(res.data.err)
            this.setState({serverErr: res.data.err})
          else
            updateAuthScreen('login')
        })
        .catch(err => console.log(err))
    else if(requestType === 'login')
      axios.post('http://localhost:5000/user/login', {user: newUser})
        .then(res => {
          this.setState({serverCall: false})
          if(res.data.err)
            this.setState({serverErr: res.data.err})
          else if(res.data) {
            this.saveUser(res.data)
            getSpotifyCode(res.data)
          }
        })
        .catch(err => console.log(err))
  }

  renderInput = authScreen => (
    <div className={`${authScreen} form`}>
      <input type="text" autoFocus
        placeholder='username'
        ref={node => this.username = node} />
      {
        authScreen === 'register' ?
        <input type="email"
          placeholder="email"
          ref={node => this.email = node}
          name="" />
        : null
      }
      <input type="password"
        placeholder='password'
        ref={node => this.password = node}
        onKeyDown={key => key.keyCode === 13 ? this.submit(authScreen) : null} />
    </div>
  )

  saveUser = user => localStorage.setItem('musiq__user', JSON.stringify(user))

  render() {

    const [showAuthScreen, updateAuthScreen] = this.props.authScreen
    const buttonClasses = [
      `button${showAuthScreen === 'login' ? ' selected' : ''}`,
      `button${showAuthScreen === 'register' ? ' selected' : ''}`
    ]

    const {serverErr, serverCall} = this.state

    return (
      <div className="auth-screen">
        <SVG src={CloseIcon} className='close'
          onClick={() => updateAuthScreen(false)} />
        <div className="buttons">
          <div className={buttonClasses[0]}
            onClick={() => showAuthScreen !== 'login' ? updateAuthScreen('login') : null} >login</div>
          <div className={buttonClasses[1]}
            onClick={() => showAuthScreen !== 'register' ? updateAuthScreen('register') : null} >register</div>
        </div>
        { this.renderInput(showAuthScreen) }
        {
          serverErr &&
          <div className="error">
            {serverErr}
            <SVG src={CancelIcon} onClick={() => this.setState({serverErr: false})} />
          </div>
        }
        <div className={`submit${serverCall ? ' disabled' : ''}`}
          disabled={this.state.serverCall}
          onClick={() => this.submit(showAuthScreen)} >
          { serverCall ? 'loading . . .' : 'submit' }
        </div>
      </div>
    )
  }
}
