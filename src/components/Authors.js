import React, { useEffect, useState } from 'react'
import BirthyearForm from './BirthyearForm'
import {
  ALL_AUTHORS, BOOK_ADDED
} from '../queries'
import {
  useQuery, useSubscription
} from '@apollo/client'





const Authors = ({show, token}) => {

 const result = useQuery(ALL_AUTHORS)
 const [authors, setAuthors] = useState([])

 useEffect(()=> {
if (result.data) {
  setAuthors(result.data.allAuthors)
}
 }, [])

const updateAuthorsCache = (cache, newBook) => {
  const includedIn = (set, object) => {
    set.map(p => p.id).includes(object.id)
  }

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
     return updatedAuthors
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
    const updatedAuthors = updateAuthorsCache(cache, newBook)
    setAuthors(updatedAuthors)
  }
})



  if (!show) {
    return null
  }

 
 

  if (result.loading) {
    return <div>Loading... </div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
{token ? <BirthyearForm authors={authors.map(a => a.name)}/> : null}
    </div>
  )
}

export default Authors