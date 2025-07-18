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
import Footer from './components/shared/Footer.jsx'
import PrivateRoute from './components/shared/PrivateRoute.jsx'
import Createpost from './pages/Createpost.jsx'
import AdminPrivateRoute from './components/shared/AdminPrivateRoute.jsx'
import EditPost from './pages/EditPost.jsx'
import PostDetails from './pages/PostDetails.jsx'
import ScrollToTop from './components/shared/ScrollToTop.jsx'
import Search from './pages/Search.jsx'


const App = () => {
  return (
    
   <BrowserRouter>
   <Header/>
   <ScrollToTop/>
   <Routes>
    <Route path='/sign-up' element={<SignUpForm/>}/>
    <Route path='/sign-in' element={< SignInForm/>}/>
    <Route path='/' element={<Home/>}/>
    <Route path='/about' element={<About/>}/>
    <Route path='/search' element={<Search/>}/>
    <Route element={<PrivateRoute/>}>
    <Route path='/dashboard' element={<Dashboard/>}/>
    </Route>
    <Route element={<AdminPrivateRoute/>}>
    <Route path='/create-post' element={<Createpost/>}/>
    <Route path='/update-post/:postId' element={<EditPost/>}/>
    </Route>
    <Route path='/news' element={<Newsarticle/>}/>
    <Route path='/post/:postSlug' element={<PostDetails/>}/>


   </Routes>
   <Footer/>
   <Toaster/>
   </BrowserRouter>
  )
}

export default App
