import React, { useState, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Books = ( { show, mode } ) => {

const result = useQuery(ALL_BOOKS)

const [genre, setGenre] = useState('')
const user = useQuery(ME)
const books = result.data ? result.data.allBooks : []
const booksByGenre = genre ? books.filter(book => book.genres.includes(genre)) : books


useEffect(()=> {
if (user.data && mode === 'recommendations') {
  setGenre(user.data.me.favoriteGenre)
} else if (mode == 'allBooks') {
  setGenre('')
}

}, [mode, user.data])



const genres = books.map(book => book.genres
  .find(genre => genre))
  .reduce((unique, item) => 
  {
    return unique.includes(item) ? unique : [...unique, item]
  }, [])

 



  if (!show) {
    return null
  }


if (result.loading) {
  return <div>Loading...</div>
}


if (mode === 'allBooks') {
return (
    <div>
    <div>
      <h2>Books ({genre ? `genre: ${genre}` : 'all'})</h2>

      {genres.map(genre => <button value={genre} key={genre} onClick={({ target } )=> setGenre(target.value) }>{genre}</button>)}
      </div>

      <BooksTable books={booksByGenre}/>
    </div>
  )
} else if (mode === 'recommendations') {
  return (
    <div>
    <h2>Books in your favorite genre ({genre})</h2>
  <BooksTable books={booksByGenre}/>
  </div>
  )
}

  
}

export default Books