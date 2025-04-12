import { Profile } from "./Profile"
import { AllOrders } from "./AllOrders"
import {PendingOrders} from "./PendingOrders"
import { Setting } from "./Settings"
import { MyOrders } from "./MyOrders"
import { Analytics } from "./Analytics"
import { AddItem } from "./AddItem"
import {Menu} from "./Menu"

// checkout - user , menu - user 


// add item - admin , menu - admin 




// cloudinary ===> image upload , image delete 

// available ====> menu , paymentMethod ===> orders




export function Dashboard(){
    return (
        
        <>
            <div>WELCOME TO DASHBOARD</div>
            {/* <PendingOrders></PendingOrders>  */}
            {/* <AllOrders></AllOrders> */}
            {/* <Profile></Profile> */}
            {/* <Setting></Setting> */}
            {/* <MyOrders></MyOrders> */}
            {/* <Analytics></Analytics> */}
            {/* <AddItem></AddItem> */}
            <Menu></Menu>
            

        </>
    )
}