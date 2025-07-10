import BottomNavBar from '@/components/shared/BottomNavBar';
import DashboardProfile from '@/components/shared/DashboardProfile';
import DashboardSidebar from '@/components/shared/DashboardSidebar'
import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
 const location = useLocation();
  const [tab, settab] = useState("");
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl   = urlParams .get("tab");
    // console.log(tabFromUrl);
    if(tabFromUrl){
      settab(tabFromUrl);
    } 

  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row w-full'>
        {/* Sidebar */}
        <div className='hidden md:block'>
            <DashboardSidebar/>
        </div>
        < BottomNavBar/>
        {/* profile */}
        <div className='w-full'>
          {tab === "profile" && <div><DashboardProfile/></div>} 
        </div>

    </div>
  )
}

export default Dashboard
