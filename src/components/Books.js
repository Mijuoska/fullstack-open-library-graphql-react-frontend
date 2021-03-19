import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Books = ( { show, mode } ) => {


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