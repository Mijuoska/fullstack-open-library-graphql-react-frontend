import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Books = ( { show, mode } ) => {

const [genre, setGenre] = useState('')
const [genres, setGenres] = useState([])
const user = useQuery(ME)


const booksResult = useQuery(ALL_BOOKS, {
  onCompleted: (data) => {

    setGenres(data.allBooks.map(book => book.genres
        .find(genre => genre))
      .reduce((unique, item) => {
        return unique.includes(item) ? unique : [...unique, item]
      }, []))
  }
})


const [getBooksByGenre, booksByGenreResult] = useLazyQuery(ALL_BOOKS, {
  variables: {genre: genre}
})



const books = !genre && booksResult.data ? booksResult.data.allBooks
 : genre && booksByGenreResult.data ? booksByGenreResult.data.allBooks : []


useEffect(()=> {
  if (genre) {
    getBooksByGenre(genre)
  }

if (user.data) {
  if (mode === 'recommendations') {
    setGenre(user.data.me.favoriteGenre)
  } 
}

}, [mode, genre])




  if (!show) {
    return null
  }


if (booksResult.loading || booksByGenreResult.loading) {
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