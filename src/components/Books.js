import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery, useSubscription } from '@apollo/client'
import { ALL_BOOKS, ALL_AUTHORS, BOOK_ADDED, ME } from '../queries'
import BooksTable from './BooksTable'

const Books = ( { show, mode, setMessage } ) => {


const [books, setBooks] = useState([])
const [genre, setGenre] = useState('')
const [genres, setGenres] = useState([])
const user = useQuery(ME)

const [getBooks, allBooks] = useLazyQuery(ALL_BOOKS, {
  onCompleted: (data) => {
   
    setBooks(data.allBooks)
       

  }
})


const [getBooksByGenre, booksByGenre] = useLazyQuery(ALL_BOOKS, {
  variables: {genre: genre},
  onCompleted: (data) => {
    setBooks(data.allBooks)
  }

})



useEffect(()=> {
  if (!genre) {
    getBooks()
  }

if (allBooks.data) {
setGenres(allBooks.data.allBooks.map(book => book.genres
    .find(genre => genre))
  .reduce((unique, item) => {
    return unique.includes(item) ? unique : [...unique, item]
  }, []))
  }




if (user.data && mode === 'recommendations') {
  setGenre(user.data.me.favoriteGenre)
}


if (genre) {
  getBooksByGenre(genre)
}

}, [mode, genre])



const updateBooksCache = (cache, newBook) => {
  const includedIn = (set, object) => {
    set.map(p => p.id).includes(object.id)
  }

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
     return updatedBooks
  }

}



useSubscription(BOOK_ADDED, {
  onSubscriptionData: ({ client,
    subscriptionData
  }) => {
    const newBook = subscriptionData.data.bookAdded
    const { cache } = client
    const updatedBooks = updateBooksCache(cache, newBook)
    setBooks(updatedBooks)
    setMessage({
      content: `New book "${newBook.title}" by ${newBook.author.name} added`,
      type: 'success'
    })
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }
})






  if (!show) {
    return null
  }


if (allBooks.loading || booksByGenre.loading) {
  return <div>Loading...</div>
}


if (mode === 'allBooks') {
return (
    <div>
    <div>
      <h2>Books ({genre ? `genre: ${genre}` : 'all'})</h2>
      <button onClick={() => setGenre('')}>All</button>
      {genres.map(genre => <button value={genre} key={genre} onClick={({ target } )=> setGenre(target.value) }>{genre}</button>)}
      </div>

      <BooksTable books={books}/>
    </div>
  )
} else if (mode === 'recommendations') {
  return (
    <div>
    <h2>Books in your favorite genre ({genre})</h2>
  <BooksTable books={books}/>
  </div>
  )
}

  
}

export default Books