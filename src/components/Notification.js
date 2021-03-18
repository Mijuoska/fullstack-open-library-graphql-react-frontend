import { React } from 'react'

const Notification = ({ message }) => {
const style = {
    backgroundColor: message.type === 'success' ? 'green' : 'red',
    color: 'white',
    padding: '10px',
    marginTop: '4px',
    border: '1px solid black',
    borderRadius: '3px',
    width: '12%'
}

if (!message) {
    return null
}
    return (
        <div style={style}>
        {message.content}
        </div>

    )

}

export default Notification