import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import {useState , useEffect} from "react";
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  {Navbar , Sidebar }  from "./components";
import { useStateContext } from "./contexts/ContextProvider";
import { ToastContainer } from "react-toastify";
import { sucess_toast} from './util/toastNotification';
import NewCorpsEtat from "./pages/CorpsEtat/NewCorpsEtat";
import NewProject from "./pages/Project/CRUD/NewProject";
import NewArticle from "./pages/Article/NewArticle";
import NewResponsiableProject from "./pages/ResponsiableProject/NewResponsiableProject";
import NewStructureProject from "./pages/StructureProject/CRUD/NewStructureProject";
import NewEmployee from "./pages/Employee/NewEmployee";
import StructureProject from "./pages/StructureProject/StructureProject";
import LoginPage from "./pages/Login/LoginPage";
import Profile from "./pages/Responsiable Pages/Profile";
import AddCsvEmployee from "./pages/Employee/AddCsvEmployee";

function  App() {

   const { activeMenu ,isResponsiableLoggedIn ,setIsResponsiableLoggedIn ,setIsAdminLoggedIn,isAdminLoggedIn} = useStateContext();

   const [userUid , setUserUid] = useState("");


  const auth = getAuth();

   useEffect(() => {
   onAuthStateChanged(auth, (user) => {

  if (user && user.email === 'test@gmail.com') {

    setIsAdminLoggedIn(true);
    
    const uid = user.uid;

    setUserUid(uid);
    
    sucess_toast('Admin Login successfully');
   
    return 1;
  } else if(user){
    setIsResponsiableLoggedIn(true);

    const uid = user.uid;

    setUserUid(uid);
    
    sucess_toast('Welcome Responsiable');
    return 1;

  } else {

    setUserUid("");
    setIsResponsiableLoggedIn(false);
    signOut(auth);
    return 1;

  }
}
)
  }, []);
   

  return (
    <div>
      <div>        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    
      {/* ? Admin Pages */}
    
        {isAdminLoggedIn ? (<> 

        <BrowserRouter>
          <div className="flex relative  h-screen overflow-hidden">
            {activeMenu ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                <Sidebar />
              </div>
            ) : (
              <div className="w-0 dark:bg-secondary-dark-bg">
                <Sidebar />
              </div>
            )}
            <div
              className={
                activeMenu
                  ? "bg-main-bg min-h-screen md:ml-72 w-full overflow-y-auto"
                  : "bg-main-bg  w-full min-h-screen flex-2 overflow-y-auto"
              }
            >
              <div className="fixed md:static bg-main-bg  navbar w-full ">
                <Navbar />
              </div>

              <div className="ml-10 RoutesWrapper h-full overflow-y-auto mr-4">
                <Routes>
                  <Route path="/NewProject" element={<NewProject />} />
                  <Route path="/NewCorpsEtat" element={<NewCorpsEtat />} />
                  <Route path="/NewArticle" element={<NewArticle />} />
                  <Route path="/NewEmployee" element={<NewEmployee />} />
                  <Route path="/AddCsv" element={<AddCsvEmployee />} />
                  <Route path="/NewResponsiableProject" element={<NewResponsiableProject />} />
                  <Route path="/NewStructureProject" element={<NewStructureProject />} />
                  <Route path="/StructureProject" element={<StructureProject />} />
                </Routes>
              </div>
            </div>
          </div> 
        </BrowserRouter> 
        
        </> ) : isResponsiableLoggedIn ? (<>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Profile  parameter={userUid} />} />
          </Routes>
        </BrowserRouter>
        </>) : (<>
          <LoginPage/>

        </>)
        }
      </div>
    </div>
  );
}

export default App;


