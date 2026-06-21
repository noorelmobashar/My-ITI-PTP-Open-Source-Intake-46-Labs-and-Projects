import './App.css'
import Home from './pages/Home/Home'
import Layout from './layouts/Layout/Layout'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Settings from './pages/Settings/Settings'
import Courses from './pages/Courses/Courses'
import CourseDetails from './pages/CourseDetails/CourseDetails'
import NotFound from './pages/NotFound/NotFound'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
function App() {

  let x = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "courses", element: <Courses /> },
      { path: "courses/:id", element: <CourseDetails /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "settings", element: <Settings /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  ]);

  return (
    <>
      <RouterProvider router={x} />
    </>
  )
}

export default App

