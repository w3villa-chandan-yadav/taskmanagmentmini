import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import { store } from './redux/stores/store.js'
  import { ToastContainer } from 'react-toastify';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store={store}>
    <App />
    <ToastContainer
      toastClassName="custom-toast"

    />
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)


// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import HomePage from './pages/HomePage'
// import FrontPage from './pages/FrontPage'
// import RightPanelPage from './components/RightPanelPage'

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <HomePage />,
//     children: [
//       {
//         index: true,
//         element: <FrontPage />,
//         handle: { target: 'left' }
//       },
//       {
//         path: 'right',
//         element: <RightPanelPage />,
//         handle: { target: 'right' }
//       }
//     ]
//   }
// ])

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// )
