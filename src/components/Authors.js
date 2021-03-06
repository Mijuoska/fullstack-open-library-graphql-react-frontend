import React from 'react'
import BirthyearForm from './BirthyearForm'
import {
  ALL_AUTHORS
} from '../queries'
import {
  useQuery
} from '@apollo/client'


const Authors = ({show, token}) => {

const result = useQuery(ALL_AUTHORS)


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
          {result.data.allAuthors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
{token ? <BirthyearForm 
authors={result.data.allAuthors.map(a => a.name)}/> : null}
    </div>
  )
}

export default Authors