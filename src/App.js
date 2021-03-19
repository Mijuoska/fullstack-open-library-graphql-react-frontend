import React, { useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import { BOOK_ADDED } from './queries'



const App = () => {
  const [page, setPage] = useState('authors')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(null)
  const [favoriteGenre, setFavoriteGenre] = useState('')
  const client = useApolloClient()

useSubscription(BOOK_ADDED, {
  onSubscriptionData: ({ subscriptionData }) => {
    const title = subscriptionData.data.bookAdded.title
    const author = subscriptionData.data.bookAdded.author.name
    setMessage({content: `New book "${title}" by ${author} added`, type: 'success'})
      setTimeout(() => {
        setMessage('')
      }, 3000)
  }
})


useEffect(()=> {
if (localStorage.getItem('library-user-token')) {
  setToken(localStorage.getItem('library-user-token'))
} else {
  setPage('login')
}


}, [])




const logout = () => {
  setToken(null)
  localStorage.clear()
  client.resetStore()
  setPage('login')
  setMessage({content: 'Successfully logged out', type:'success'})
  setTimeout(() => {
    setMessage('')
  }, 3000);
}



  

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('allBooks')}>Books</button>
        {token ? <button onClick={()=> setPage('recommendations')}>Recommendations</button> : null}
      {token ? <button onClick={() => setPage('add')}>Add Book</button> : null }
      {token ? <button onClick={() => logout()}>Logout</button> : 
        <button onClick={() => setPage('login')}>Login</button>}
         
      </div>

      <Notification message={message}/>
      <Authors
        show={page === 'authors'}
        token={token}
      />

      <Books
        show={page === 'allBooks'}
        mode={page}
      />

        <Books
        show={page === 'recommendations'}
        mode={page}
        favoriteGenre={favoriteGenre}
      />

      <NewBook
        show={page === 'add'}
        setMessage={setMessage}
      />

      <LoginForm
        show={page === 'login'}
        setToken={setToken}
        setPage={setPage}
        setMessage={setMessage}
        />

    </div>
  )
}

export default App