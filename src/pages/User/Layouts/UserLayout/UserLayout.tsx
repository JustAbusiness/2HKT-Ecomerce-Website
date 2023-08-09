import React from 'react';
import UserSideNav from '../../components/UserSideNav';
import { Outlet } from 'react-router-dom';


const UserLayout = () => {
    return (
        <div className='bg-neutral-200 py-16 text-sm text-gray-600'>
            <div className="container">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                    <div className="md:col-span-3 lg:col-span-2">
                        <UserSideNav></UserSideNav>
                    </div>
                    
                    <div className="md:col-span-9 lg:col-span-9">
                        <Outlet></Outlet>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserLayout;