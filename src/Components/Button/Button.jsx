import React from 'react'
import './Button.css'

export default function Button({text, onClick,type,disabled}) {
  return (
    <div>
      <button  className='button' type={type} onClick={onClick} disabled={disabled}>{text || "Opérations"}</button>
    </div>
  )
}
