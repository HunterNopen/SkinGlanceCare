import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import fileIcon from '../../public/file.png';
import frameIcon from '../../public/frame.png';
const Dashboard = () => {

  const navigate = useNavigate();

  return (

    <>
    <div className="flex gap-50 ">
    <div onClick={()=>navigate("/analysis")} className="w-[400px] h-[400px] pt-4 rounded-t-4xl bg-amber-100 text-center border-8 border-black-600 flex flex-col justify-between items-center ">
      <img src={frameIcon} alt="frame" className="w-[300px] h-[300px] rounded-t-lg" />
       <h2 className="text-xl font-bold mb-4">Analyze Medical Image</h2>
    </div>
    <div className="w-[400px] h-[400px] pt-4 rounded-t-4xl bg-amber-100 text-center border-8 border-black-600 flex flex-col justify-between items-center ">
      <img src={fileIcon} alt="frame" className="w-[300px] h-[300px] rounded-t-lg" />
       <h2 className="text-xl font-bold mb-4">View history</h2>
    </div>
    </div>


    </>
  );
};

export default Dashboard;
