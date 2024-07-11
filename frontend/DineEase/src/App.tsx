import {BrowserRouter,Routes,Route} from "react-router-dom"
import {UserSignup} from "./Components/User/UserSignup"
import {UserSignin} from "./Components/User/UserSignin"
import {UserHome} from "./Components/User/UserHome"
import {UserCart} from "./Components/User/UserCart"
import {UserProfile} from "./Components/User/UserProfile"
import {UserMenu} from "./Components/User/UserMenu"
import { AdminSignin } from "./Components/Admin/AdminSignin"
import {AdminSignup} from "./Components/Admin/AdminSignup"
import {AdminDashboard} from "./Components/Admin/AdminDashboard"
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserSignup></UserSignup>}></Route>
          <Route path="/signin" element={<UserSignin></UserSignin>}></Route>
          <Route path="/home" element={<UserHome></UserHome>}></Route>
          <Route path="/profile" element={<UserProfile></UserProfile>}></Route>
          <Route path="/menu" element={<UserMenu></UserMenu>}></Route>
          <Route path="/cart" element={<UserCart></UserCart>}></Route>
          <Route path="/admin/signup" element={<AdminSignup></AdminSignup>}></Route>
          <Route path="/admin/signin" element={<AdminSignin></AdminSignin>}></Route>
          <Route path="/admin/dashboard" element={<AdminDashboard></AdminDashboard>}></Route>
        </Routes>
      </BrowserRouter>
     
    </>
  )
}

export default App


