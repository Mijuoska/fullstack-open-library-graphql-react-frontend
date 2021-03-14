
import React from 'react'
import { useQuery, gql } from '@apollo/client'

const Books = ({show}) => {

  const ALL_BOOKS = gql `
  query {allBooks {
    title
    author
    published
  }
}

`

const result = useQuery(ALL_BOOKS)
const books = result.data ? result.data.allBooks : []

  if (!show) {
    return null
  }




if (result.loading) {
  return <div>Loading...</div>
}

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(b =>
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.published}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books