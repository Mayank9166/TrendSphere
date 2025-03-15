import React from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import SignUpForm from './auth/forms/SignUpForm'
import SignInForm from './auth/forms/SignInForm'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Newsarticle from './pages/NewsArticle'

const App = () => {
  return (
   <BrowserRouter>
   <Routes>
    <Route path='/sign-up' element={<SignUpForm/>}/>
    <Route path='/sign-in' element={< SignInForm/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/news' element={<Newsarticle/>}/>


   </Routes>
   </BrowserRouter>
  )
}

export default App
