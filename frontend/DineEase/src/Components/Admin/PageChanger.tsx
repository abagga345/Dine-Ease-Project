interface inputprops{
    skipcnt:number;
    setSkipCnt:React.Dispatch<React.SetStateAction<number>>;
}
export function PageChanger({skipcnt,setSkipCnt}:inputprops){
    return(
        <>
 
    <div className="bg-white w-fit">
      <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
        <a href="#" onClick={(event)=>{
            event.preventDefault();
            if (skipcnt==1) return;
            else setSkipCnt((prev)=>prev-1);

        }} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span className="sr-only">Previous</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </a>
        
        <a href="#" onClick={(event)=>{event.preventDefault();setSkipCnt(1)}} aria-current="page" className={`relative z-10 inline-flex items-center text-gray-900 ${(skipcnt==1)?'bg-indigo-600':''}  px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>1</a>
        <a href="#" onClick={(event)=>{event.preventDefault();setSkipCnt(2)}} aria-current="page" className={`relative z-10 inline-flex items-center text-gray-900 ${(skipcnt==2)?'bg-indigo-600':''}  px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>2</a>
        <a href="#" onClick={(event)=>{event.preventDefault();setSkipCnt(3)}} aria-current="page" className={`relative z-10 inline-flex items-center text-gray-900 ${(skipcnt==3)?'bg-indigo-600':''}  px-4 py-2 text-sm font-semibold  focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>3</a>
        
        {/* <a href="#" onClick={(event)=>{event.preventDefault();setSkipCnt(2)}} className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">2</a>
        <a href="#" onClick={(event)=>{event.preventDefault();setSkipCnt(3)}}  className="relative hidden items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex">3</a> */}
        <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
        
        <a href="#" onClick={(event)=>{event.preventDefault();setSkipCnt((prev)=>prev+1)}} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
          <span className="sr-only">Next</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </a>
      </nav>
    </div>

        </>
    )
}