import React, { createContext, useContext, useState } from 'react';

const StateContext = createContext();

const initialState = {
  activeMenu:true,
  isLoading:true,
  IsResponsiableLoggedIn: false,
  tableControl:false,
  showFacture:false,
  isAdminLoggedIn:false,
};

export const ContextProvider = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState(true);
  const [screenSize, setScreenSize] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false); 
  const [tableControl, setTableControl] = useState(false); 
  const [showFacture, setShowFacture] = useState(false); 
  const [showHistoric, setShowHistoric] = useState(false); 
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); 
  const [isResponsiableLoggedIn, setIsResponsiableLoggedIn] = useState(false); 
  
  return (
    <StateContext.Provider
      value={{
        isLoading, 
        setIsLoading, 
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        tableControl,
        setTableControl, 
        showFacture,
        setShowFacture,
        activeMenu,
        setActiveMenu,
        screenSize,
        setScreenSize,
        initialState,
        isResponsiableLoggedIn,
        setIsResponsiableLoggedIn,
        showHistoric,
        setShowHistoric
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
