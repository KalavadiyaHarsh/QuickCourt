import React from 'react';

const KPICard = ({ title, value, icon }) => {
  return (
    <div className='bg-white p-5 rounded-2xl shadow hover:shadow-lg transition duration-300'>
      <div className='flex items-center space-x-4'>
        <div className='text-blue-500 text-3xl'>
          {icon}
        </div>
        <div>
          <p className='text-gray-500'>{title}</p>
          <h2 className='text-2xl font-bold'>{value}</h2>
        </div>
      </div>
    </div>
  );
}

export default KPICard;