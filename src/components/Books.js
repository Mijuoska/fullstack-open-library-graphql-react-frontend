import React, { useState, useEffect } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Books = ( { show, mode } ) => {

const [genre, setGenre] = useState('')
const [genres, setGenres] = useState([])
const [favoriteGenre, setFavoriteGenre] = useState('')
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
  variables: {genre: mode == 'recommendations' && favoriteGenre ? favoriteGenre : genre}
})



// If no genre is selected or recommendation page is not displayed, show all books. Otherwise if either a genre is selected or user views recommendations, show results
// from getBooksByGenre
const books = (!genre && !favoriteGenre) && booksResult.data ? booksResult.data.allBooks
 : (genre || favoriteGenre) && booksByGenreResult.data ? booksByGenreResult.data.allBooks : []


useEffect(()=> {

if (user.data) {
  if (mode === 'recommendations') {
    setFavoriteGenre(user.data.me.favoriteGenre)
  } 
}

  if (genre || favoriteGenre) {
     console.log(favoriteGenre)
    getBooksByGenre()
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
      {genres.filter(genre => genre != undefined).map(genre => <button value={genre} key={genre} onClick={({ target } )=> setGenre(target.value) }>{genre}</button>)}
      </div>

 <BooksTable books={books}/>

    </div>
  )
} else if (mode === 'recommendations') {
  return (
    <div>
    <h2>Books in your favorite genre ({favoriteGenre})</h2>
   <BooksTable books={books}/>
  </div>
  )
}

  
}

export default Books