import AppAppBar from "../Home/AppAppBar"
import Footer from "../Home/Footer"
import {SignupCard} from "./SignupCard"
export function UserSignup(){
    return (
        <>
            
            <div className="h-screen w-screen" style={{backgroundColor:"#f7f7f7"}}>
                <div className="mb-20 ">
                    <AppAppBar></AppAppBar>
                </div>
                <SignupCard></SignupCard>
                <div className="bg-white mt-20">
                    <Footer ></Footer>
                </div>
                
            </div>
            
        </>
    )
}