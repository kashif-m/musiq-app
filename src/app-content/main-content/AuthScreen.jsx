
import React, { Component } from 'react'
import axios from 'axios'

export default class AuthScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount() {

    const [user, updateUser] = this.props.user
    const [authScreen, updateAuthScreen] = this.props.authScreen

    if(!user)
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

    const [user, updateUser] = this.props.user
    const [authScreen, updateAuthScreen] = this.props.authScreen

    const newUser = {
      username: this.username.value,
      password: this.password.value
    }

    if(requestType === 'register')
      axios.post('http://localhost:5000/user/new', {user: newUser})
        .then(res => {
          console.log(res.data)
          console.log('registered.')
          updateAuthScreen('login')
        })
        .catch(err => console.log(err))
    else if(requestType === 'login')
      axios.post('http://localhost:5000/user/login', {user: newUser})
        .then(res => {
          if(res.data) {
            console.log(res.data)
            updateUser(res.data)
            updateAuthScreen(false)
          }
        })
        .catch(err => console.log(err))
  }

  renderInput = authScreen => (
    <div className={`${authScreen} form`}>
      <input type="text" autoFocus
        placeholder='username'
        ref={node => this.username = node}
         />
      <input type="password"
        placeholder='password'
        ref={node => this.password = node}
         />
    </div>
  )

  render() {

    const [showAuthScreen, updateAuthScreen] = this.props.authScreen
    const buttonClasses = [
      `button${showAuthScreen === 'login' ? ' selected' : ''}`,
      `button${showAuthScreen === 'register' ? ' selected' : ''}`
    ]

    return (
      <div className="auth-screen">
        <img src={require('../../assets/images/close.svg')} alt="x"
          onClick={() => updateAuthScreen(false)} />
        <div className="buttons">
          <div className={buttonClasses[0]}
            onClick={() => showAuthScreen !== 'login' ? updateAuthScreen('login') : null} >login</div>
          <div className={buttonClasses[1]}
            onClick={() => showAuthScreen !== 'register' ? updateAuthScreen('register') : null} >register</div>
        </div>
        {
          showAuthScreen === 'login'
          ? this.renderInput(showAuthScreen)
          : this.renderInput(showAuthScreen)
        }
        <div className="submit"
          onClick={() => this.submit(showAuthScreen)} >submit</div>
      </div>
    )
  }
}