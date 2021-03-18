import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Books = ( { show } ) => {


const result = useQuery(ALL_BOOKS)
const [ genre, setGenre ] = useState('')
const books = result.data ? result.data.allBooks : []
const booksByGenre = genre ? books.filter(book => book.genres.includes(genre)) : books


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

  return (
    <div>
      <h2>Books ({genre ? `genre: ${genre}` : 'all'})</h2>
      

      {genres.map(genre => <button value={genre} onClick={({ target } )=> setGenre(target.value) }>{genre}</button>)}
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>
              Author
            </th>
            <th>
              Published
            </th>
          </tr>
          {booksByGenre.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books