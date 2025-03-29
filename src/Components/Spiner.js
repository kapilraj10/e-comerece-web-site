import React from 'react'
import SpinerImage from '../Assets/Spinner.svg'

const Spiner = () => {
  return (
    <div className='my-8 text-center' style={{height:"70px"}}>
        <img className='h-81' src={SpinerImage} alt='' />
    </div>
  )
}

export default Spiner