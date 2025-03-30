import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Height } from '@mui/icons-material';
import useSWR from 'swr';

interface Innermost{
  id:number;
  houseStreet:string;
  pincode:string;
  city:string;
}

interface resultdata{
  addresses:Innermost[]
}

async function fetcher(url:string):Promise<resultdata>{
    let token=localStorage.getItem("token");
    if (token===null) throw Error();
    let result=await fetch(url,{
      headers:{
        authorization:token
      }
    })
    return result.json();
}

export default function BasicSelect() {
  const {data,error,isLoading} = useSWR<resultdata>('http://localhost:3000/api/v1/user/getaddresses',fetcher);
  const [addressid, setAddressId] = React.useState(0);
  


  const handleChange = (event: SelectChangeEvent) => {
    setAddressId(parseInt(event.target.value));
    
  };
  if (error || data===undefined){
    //navigate to 404 page;

    return;
  }
  else if (isLoading){
    //display skeleton
  }
  else if (data.addresses.length===0){
    //navigate to add address page
  }

  return (
    <Box sx={{ minWidth: 120, height:4/5}}>
      <FormControl fullWidth sx={{height:4/5}}>
        <InputLabel id="demo-simple-select-label" sx={{fontSize:'1.3rem'}}>Choose Address</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={addressid.toString()}
          label="Address"
          onChange={handleChange}
          
        >
          {
            data.addresses.map((item:Innermost)=>{
              return(
                <MenuItem value={item.id}>{item.id + " " + item.houseStreet + " " +item.city}</MenuItem>
              )
              
            })
          }
          {/* <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem> */}
        </Select>
      </FormControl>
    </Box>
  );
}
