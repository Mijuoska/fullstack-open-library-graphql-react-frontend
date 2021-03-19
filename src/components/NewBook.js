import React, { useState } from 'react'
import {useMutation} from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK } from '../queries'


const NewBook = ({show, setMessage}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])




const [createBook] = useMutation(CREATE_BOOK, {
  onError: ({ graphQLErrors, networkError}) => {
   const errorMsg = graphQLErrors.length > 0 ? graphQLErrors[0].message : networkError
    setMessage({content: errorMsg, type: 'error'})
setTimeout(() => {
  setMessage('')
}, 3000)
    
  },
  update: (store, response) => {
   const booksInStore = store.readQuery({query: ALL_BOOKS})
   const authorsInStore = store.readQuery({query: ALL_AUTHORS})
   store.writeQuery({
     query: ALL_BOOKS
    },
    {data: {
      ...booksInStore, allBooks: [...booksInStore.allBooks, response.data.addBook]
    }}
    )
    store.writeQuery({
      query: ALL_AUTHORS
    }, {
      data: {
        ...authorsInStore,
        allAuthors: response.data.allAuthors
      }
    })
  }
})


  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()

  const variables = {
    title: title,
    published: Number(published),
    author: author,
    genres: genres
  }

    createBook({variables: variables})
    

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')

  
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='number'
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">add genre</button>
        </div>
        <div>
          genres: {genres.join(' ')}
        </div>
        <button type='submit'>create book</button>
      </form>
    </div>
  )
}

export default NewBook