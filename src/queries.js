import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql `
  query {allAuthors {
  name
  born
  bookCount
  id
  }

  }
`

export const ALL_BOOKS = gql `
  query findBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
    title
    author {
      name
      born
    }
    published
    genres
  }
}


`


export const CREATE_BOOK = gql `
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]){
addBook(
  title: $title,
  published: $published,
  author: $author,
  genres: $genres
){
    title
    published
    author {
      name
      born
      bookCount
    }
    genres
}
}
`

export const UPDATE_AUTHOR = gql `
mutation updateAuthor($name: String!, $born: Int!) {
 editAuthor(
         name: $name
         setBornTo: $born
) {
    name
    born
    bookCount
    id
}
}
`

export const LOGIN = gql `
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value

    }
  }
`

export const ME = gql `
query {me {
  favoriteGenre
}
}
`

export const BOOK_ADDED = gql `
subscription {
  bookAdded {
     title
     published
     author {
       name
       bookCount
     }
     genres
  }
}
`