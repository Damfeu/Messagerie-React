import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import OtpCode from './Pages/OtpCode/OtpCode.jsx';
import Group from './Pages/Group/Group.jsx';
import {
  createBrowserRouter,RouterProvider,} from "react-router-dom";
  import Registration from './Pages/Registration/Registration.jsx';

import './index.css'

import Dashbord from './Pages/Dashbord/Dashbord.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/login",
    element: <App />,
  },
 
  {
    path: "/dashbord",
    element: <Dashbord />,
  },

  {
    path: "/group",
    element: <Group />,
  },
  
  {
    path: "/otp-code",
    element: <OtpCode />,
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)



