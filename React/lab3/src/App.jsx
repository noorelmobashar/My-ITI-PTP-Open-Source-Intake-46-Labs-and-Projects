import './App.css';
import Home from './pages/Home/Home';
import Layout from './layouts/Layout/Layout';
import About from './pages/About/About';
import CoursesLayout from './pages/CoursesLayout/CoursesLayout';
import CoursesList from './pages/CoursesList/CoursesList';
import CourseDetails from './pages/CourseDetails/CourseDetails';
import AddCourse from './pages/AddCourse/AddCourse';
import NotFound from './pages/NotFound/NotFound';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { 
          path: "", 
          element: <Home /> 
        },
        { 
          path: "about", 
          element: <About /> 
        },
        {
          path: "courses",
          element: <CoursesLayout />,
          children: [
            { 
              path: "", 
              element: <CoursesList /> 
            },
            { 
              path: ":id", 
              element: <CourseDetails /> 
            },
            { 
              path: "add", 
              element: <AddCourse /> 
            }
          ]
        },
        { 
          path: "*", 
          element: <NotFound /> 
        }
      ]
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
