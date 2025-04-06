import AppAppBar from "../Home/AppAppBar"
import Footer from "../Home/Footer"
import { SigninCard } from "./SigninCard"
export function UserSignin(){
    return (
        <div className="h-screen w-screen" style={{backgroundColor:"#f7f7f7"}}>
            <div className="mb-20 ">
                <AppAppBar></AppAppBar>
            </div>
            <SigninCard></SigninCard>
            <div className="bg-white mt-20">
                <Footer ></Footer>
            </div>
        </div>
    )
}

