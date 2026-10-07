import { useState } from 'react'
import './App.css'
import Shape from './Shape'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Shape/>
    </>
  )
}

export default App
