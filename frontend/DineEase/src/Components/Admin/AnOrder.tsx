import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface Order{
    id: number;
    amount: number;
    description: string;
    status: "Pending" | "Completed" | "Cancelled";
    username: string;
    timestamp: string;
    items : Items[];
}
interface Details {
    title : string,
}
interface Items {
  id : number,
  quantity : number,
  itemId : number,
  orderId : number,
  item : Details
}

export function AnOrder({description,id,amount,items}:Order){
    return (


 <div className="mt-3 w-full p-4 max-w-md rounded-lg shadow  bg-gray-800 border-gray-700">
     <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none  text-white">Order #{id}</h5>
        <h5 className="text-xl font-bold leading-none  text-white">${amount}</h5>
        
    </div>
    
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-700">
            <li className="py-1 sm:py-2">
                <div className="flex items-center">
                    <div className="flex min-w-0 ms-4">
                        <p className="text-xl font-bold leading-none  text-white">
                            {description}
                        </p>
                       
                    </div>

                   
                    
                </div>
            </li>
 
            {items.map((Singleitem) => (
                <div className='flex justify-between'>
                <div className='text-l  leading-none  text-white'>{Singleitem.item.title}</div>
                <div className='text-l  leading-none  text-white'>{Singleitem.quantity}</div>
                </div>
            ))}

            <li>
                <div className='mt-5 flex justify-around'>
            <Stack direction="row" spacing={2}>
      <Button variant="contained" color="success">
        Success
      </Button>
      <Button variant="outlined" color="error">
        Cancel
      </Button>
    </Stack>
    </div>
            </li>
           
        </ul>
   </div>
</div>

    )
}       
