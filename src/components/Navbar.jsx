import React, { useEffect } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { useStateContext } from '../contexts/ContextProvider'; 
import {
  getAuth,
  signOut
} from 'firebase/auth';
import {FaSignOutAlt} from 'react-icons/fa';  

const NavButton = ({ customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={() => customFunc()}
    style={{ color }}
    className="text-white relative text-2xl rounded-full p-3 hover:bg-[#54ad34]"
  >
    <span style={{ background: dotColor }} className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
    {icon}
  </button>
);


const Navbar = () => {
  const { currentColor, activeMenu, setActiveMenu, setScreenSize, screenSize } = useStateContext();

  const auth = getAuth();

const handlelogout = () => {
  signOut(auth);
  window.location.href = "/"; 
}
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);



  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);


  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between mb-4 p-4 bg-[#243b8c]  relative items-center w-full  drop-shadow-xl ">
      <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
<div className='flex'>

      <NavButton title="Log Out" customFunc={handlelogout} color={currentColor} icon={<FaSignOutAlt />}  transitionDuration="2s"/>
</div>
    </div>
  );
};

export default Navbar;

