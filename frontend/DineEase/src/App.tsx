import {BrowserRouter,Routes,Route} from "react-router-dom"

// import {AdminDashboard} from "./Components/Admin/AdminDashboard"
import './App.css'
import {AdminSignin} from "./Components/Admin/SignIn/AdminSignin"
import {UserSignin} from "./Components/User/SignIn/UserSignin"
import {UserSignup} from "./Components/User/SignUp/UserSignup"
import {UserHome} from "./Components/User/Home/UserHome"
import { ErrorPage } from "./Components/common/errorpage"
import { Dashboard } from "./Components/Admin/Dashboard/Dashboard"
import { Profile } from "./Components/User/Profile/Profile"
import { Checkout } from "./Components/User/checkout/Checkout"
import { Menu } from "./Components/User/Menu/menu"
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserHome></UserHome>}></Route>
          <Route path="/signup" element={<UserSignup></UserSignup>}></Route>
          <Route path="/signin" element={<UserSignin></UserSignin>}></Route>
          <Route path="/home" element={<UserHome></UserHome>}></Route>
          <Route path="/profile" element={<Profile></Profile>}></Route>
          <Route path="/menu" element={<Menu></Menu>}></Route>
          <Route path="/checkout" element={<Checkout></Checkout>}></Route>
          <Route path="/admin/signin" element={<AdminSignin></AdminSignin>}></Route>
          <Route path="/admin/dashboard/" element={<Dashboard></Dashboard>}></Route>
          <Route path="/error" element={<ErrorPage link="/"></ErrorPage>}></Route>
        </Routes>
      </BrowserRouter>
     
    </>
  )
}

export default App
