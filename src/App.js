import React, { useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import Notification from './components/Notification'
import { ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED } from './queries'



const App = () => {
  const [page, setPage] = useState('authors')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState(null)
  const client = useApolloClient()


useEffect(()=> {
if (localStorage.getItem('library-user-token')) {
  setToken(localStorage.getItem('library-user-token'))
} else {
  setPage('login')
}


}, [])


 const includedIn = (set, object) => {
   set.map(p => p.id).includes(object.id)
 }

const updateBooksCache = (cache, newBook) => {
  const booksInStore = cache.readQuery({
    query: ALL_BOOKS
  })
  if (!includedIn(booksInStore.allBooks, newBook)) {
    const updatedBooks = booksInStore.allBooks.concat(newBook)
    cache.writeQuery({
      query: ALL_BOOKS
    }, {
      data: {
        allBooks: updatedBooks
      }
    })
  }

}

const updateAuthorsCache = (cache, newBook) => {
  const {
    author
  } = newBook


  const authorsInStore = cache.readQuery({
    query: ALL_AUTHORS
  })

  if (!includedIn(authorsInStore.allAuthors, author)) {
    const updatedAuthors = authorsInStore.allAuthors.concat(author)
    cache.writeQuery({
      query: ALL_AUTHORS
    }, {
      data: {
        allAuthors: updatedAuthors
      }
    })
  }

}



useSubscription(BOOK_ADDED, {
  onSubscriptionData: ({
    client,
    subscriptionData
  }) => {
    const newBook = subscriptionData.data.bookAdded
    const {
      cache
    } = client
    updateBooksCache(cache, newBook)
    updateAuthorsCache(cache, newBook)
    setMessage({
      content: `New book "${newBook.title}" by ${newBook.author.name} added`,
      type: 'success'
    })
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }
})




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