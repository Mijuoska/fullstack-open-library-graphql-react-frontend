import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import {ALL_AUTHORS, UPDATE_AUTHOR} from '../queries'


const BirthyearForm = () => {
const [name, setName] = useState('')
const [born, setBirthyear] = useState('')

const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{
        query: ALL_AUTHORS
    }]
})

const submit = (event) => {
    event.preventDefault()

    updateAuthor({
        variables:  {
            name: name,
            born: Number(born)
        }
    })
}

    return (
        <div>
        <h2>Change birth year</h2>
<form onSubmit={submit}>
<div>
Name <input type="text" value={name} onChange={({ target })=> setName(target.value)}/>
</div>
<div>
Born <input type="number" value={born} onChange={({ target })=> setBirthyear(target.value)}/>
</div>
<button type="submit">Change birth year</button>

</form> 
</div>

       


    )
}

export default BirthyearForm