import React from 'react'
import doubleCheck from '../assets/done_all.svg'
import Avatar from './Avatar'

export default function ContactBox({ contact, setContactSelected, messages, onClick, setMessage }) {
    const maxTs = messages.length!==0 && Math.max(...messages.map((m) => (new Date(m.date)).getTime()))
    const lastMsg = messages.length!==0 && messages.find((m) =>(new Date(m.date)).getTime() === maxTs)

    function truncate(text, length) {
        return text.length > length ? `${text.substring(0, length)} ...` : text
    }
    return (
        <div className="contact-box" onClick={() => {setContactSelected(contact);onClick();setMessage("")}}>
            <Avatar user={contact} />
            <div className="right-section">
                <div className="contact-box-header">
                    <h3 className="avatar-title">{contact.name}</h3>
                    { messages.length!==0 && <span className="time-mark">{(new Date(lastMsg.date)).toLocaleDateString()}</span>}
                </div>
                {lastMsg && <div className="last-msg">
                    { lastMsg.sender !== contact.id && <img src={doubleCheck} alt="" className="icon-small" />}
                    <span className="text">{truncate(lastMsg.msg, 30)}</span>
                </div>}
            </div>
        </div>
    )
}
