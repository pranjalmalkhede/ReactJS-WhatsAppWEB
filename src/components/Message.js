import React from 'react'
import doubleCheck from '../assets/done_all.svg'
import { useStateValue } from '../utils/stateprovider'

const Message=({ message }) =>{
    // console.log(message)
    const [{mainUser}] = useStateValue()
    return (
        <div className={`message ${mainUser.id===message.sender ? 'sent' : 'received'}`}>
            {message.msg}
            <div className="metadata">
                <span className="date">{(new Date(message.date)).toLocaleString()}</span>
                {mainUser.id===message.sender && <img src={doubleCheck} alt="" className="icon-small" />}
            </div>
        </div>
    )
}

export default Message