import React from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import SignUpForm from './auth/forms/SignUpForm.jsx'
import SignInForm from './auth/forms/SignInForm.jsx'
import Home from './pages/Home'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Newsarticle from './pages/NewsArticle'
import Header from './components/shared/Header'
import { Toaster } from './components/ui/sonner.jsx'

const App = () => {
  return (
    
   <BrowserRouter>
   <Header/>
   <Routes>
    <Route path='/sign-up' element={<SignUpForm/>}/>
    <Route path='/sign-in' element={< SignInForm/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/dashboard' element={<Dashboard/>}/>
    <Route path='/news' element={<Newsarticle/>}/>


   </Routes>
   <Toaster/>
   </BrowserRouter>
  )
}

export default App
