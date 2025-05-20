import {BrowserRouter,Routes,Route} from "react-router-dom"

// import {AdminDashboard} from "./Components/Admin/AdminDashboard"
import './App.css'

import {UserSignin} from "./Components/User/SignIn/UserSignin"
import {UserSignup} from "./Components/User/SignUp/UserSignup"
import {UserHome} from "./Components/User/Home/UserHome"
import { ErrorPage500 } from "./Components/common/errorpage500"
import { ErrorPage404 } from "./Components/common/errorpage404"
import { Dashboard } from "./Components/Admin/Dashboard/Dashboard"
import { OtpHandler } from "./Components/User/SignIn/OtpInput"

import { Menu } from "./Components/User/Menu/menu"
import { Toaster } from "react-hot-toast"
import { Checkout } from "./Components/User/Checkout/Checkout"
import { AllOrders } from "./Components/Admin/Dashboard/AllOrders"
import { PendingOrders } from "./Components/Admin/Dashboard/PendingOrders"
import { Analytics } from "./Components/Admin/Dashboard/Analytics"
import { AddItem } from "./Components/Admin/Dashboard/AddItem"
import { MenuItems } from "./Components/Admin/Dashboard/Menu"
import { Profile } from "./Components/Admin/Dashboard/Profile"
import { Setting } from "./Components/Admin/Dashboard/Settings"
import { MyOrders } from "./Components/Admin/Dashboard/MyOrders"
import { DashboardHome } from "./Components/Admin/Dashboard/DashboardHome"
import { Store } from "./Components/User/Store/store"
import { Addresses } from "./Components/Admin/Dashboard/Addresses"
import {MenuItem} from "./Components/User/MenuItem/MenuItem"
function App() {
  return (
    <div>
      <Toaster position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UserHome></UserHome>}></Route>
          <Route path="/signup" element={<UserSignup></UserSignup>}></Route>
          <Route path="/signin" element={<UserSignin></UserSignin>}></Route>
          <Route path="/verifyotp" element={<OtpHandler></OtpHandler>}></Route>
          <Route path="/home" element={<UserHome></UserHome>}></Route>
          <Route path="/menu" element={<Menu></Menu>}></Route>
          <Route path="/checkout" element={<Checkout></Checkout>}></Route>
          <Route path="/store" element={<Store></Store>}></Route>
          <Route path="/menuitem/:itemId" element={<MenuItem></MenuItem>}></Route>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}>
              <Route path="" element={<DashboardHome></DashboardHome>}></Route>
              <Route path="allorders" element={<AllOrders></AllOrders>}></Route>
              <Route path="pendingorders" element={<PendingOrders></PendingOrders>}></Route>
              <Route path="analytics" element={<Analytics></Analytics>}></Route>
              <Route path="additem" element={<AddItem></AddItem>}></Route>
              <Route path="menu" element={<MenuItems></MenuItems>}></Route>
              <Route path="profile" element={<Profile></Profile>}></Route>
              <Route path="settings" element={<Setting></Setting>}></Route>
              <Route path="myOrders" element={<MyOrders></MyOrders>}></Route>
              <Route path="addresses" element={<Addresses></Addresses>}></Route>
          </Route>
          <Route path="/error" element={<ErrorPage500 link="/"></ErrorPage500>}></Route>
          <Route path="*" element={<ErrorPage404 link="/"></ErrorPage404>}></Route>
        </Routes>
      </BrowserRouter>
     
    </div>
  )
}

export default App
