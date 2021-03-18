import React, { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries'

const LoginForm = ({ show, setToken, setPage, setMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setMessage({content: error.graphQLErrors[0].message, type: 'error'})
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      setMessage({content: 'successfully logged in', type: 'success'})
      setTimeout(()=> {
        setMessage('')
      }, 3000)
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()

    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
    setPage('authors')
  }

  if (!show) {
      return null
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm