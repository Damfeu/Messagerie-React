import React from 'react'
import '../Label/label.css'
import './input.css'
export default function Input(
    {
        value ,
         onChange,
          placeHolder , 
          type,
          label,
          reference
        }) {
  return (
    <div>
        <label htmlFor={reference}>{label}</label>
      <input
       type={type}
       value={value}
        placeholder={placeHolder} 
        onChange={onChange}
        id={reference} />
    </div>
  )
}
