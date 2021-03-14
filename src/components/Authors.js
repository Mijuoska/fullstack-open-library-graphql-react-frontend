import React, { useState } from 'react'
import BirthyearForm from './BirthyearForm'




const Authors = ({authors, show}) => {
  if (!show) {
    return null
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
<BirthyearForm authors={authors.map(a => a.name)}/>
    </div>
  )
}

export default Authors