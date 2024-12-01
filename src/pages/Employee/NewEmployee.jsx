import React, { useState ,useEffect} from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, query, where, addDoc, updateDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 } from "uuid";
import LoadingPage from "../../util/LoadingPage";
import { sucess_toast, error_toast, info_toast } from "../../util/toastNotification";
import ResponsableSearch from '../../components/ResponsableSearch';
import EmployeSearch from '../../components/EmployeSearch';

const NewEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [newResponsable, setNewResponsable] = useState("");

  const EmployeCollectionRef = collection(db, "employe");
  const ResponsableProjectCollectionRef = collection(db, "responsableProject");
  const auth = getAuth();

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setNewResponsable(employee);

    // console.log("Responsable :: ",employee.ID_EMPLOYE);
    // console.log("selectedEmployee",selectedEmployee);
  };
  
  const handleSelectEmployees = (employees) => {
    setSelectedEmployees(employees);
    console.log("employees :::",employees);
  };

  useEffect(() => {
    console.log("selectedEmployee ::::", selectedEmployee);
  }, [selectedEmployee]);

  const handleSubmit = async (RendomId) => {
    try {
      console.log("Creating user with email:", email);
  
      // Create new user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      console.log("User created successfully:", userCredential);
  
      // Sign out current user
      // await signOut(auth);
      console.log("Signed out successfully");


  
      // // Sign in back with the current user
      // await signInWithEmailAndPassword(auth, currentUser.email, currentUser.password);
      // console.log("Signed in successfully with current user");
  
      // Add the new user to the project
      await addDoc(ResponsableProjectCollectionRef, {
        id: RendomId,
        ID_EMPLOYE: newResponsable.ID_EMPLOYE,
        email: email,
        uid: newUser.uid,
        DATE_EFFET: new Date(),
      });
  
      console.log("User created and project added successfully");
  
    } catch (error) {
      console.error("Error creating user:", error.message);
      error_toast(`Error creating user: ${error.message}`);
    }
  };
  
  

  const SubmitProject = async () => {
    try {
      setIsLoading(true);

   
      const RendomId = v4();
 

  
      await handleSubmit(RendomId);
  
      console.log("After Handle Submit");
  
      const selectedEmployeesIds = selectedEmployees.map(emp => emp.ID_EMPLOYE);
      const employeeDocsQuery = query(
        EmployeCollectionRef,
        where("ID_EMPLOYE", "in", selectedEmployeesIds)
      );
  
      const employeDocs = await getDocs(employeeDocsQuery);
      const updatePromises = employeDocs.docs.map(doc =>
        updateDoc(doc.ref, 
          { ID_RESPONSABLE: newResponsable.ID_EMPLOYE ,
            NOM_RESPONSABLE: newResponsable.NOM ,
            PRENOM_RESPONSABLE: newResponsable.PRENOM 
          })
      );
  
      await Promise.all(updatePromises);
  
      setEmail("");
      setPassword("");
      setSelectedEmployee(null);
      setSelectedEmployees([]);
  
      sucess_toast("Responsable a été affecté avec succès");
  
    } catch (error) {
      console.error("Error submitting project:", error.message);
      error_toast(`Erreur lors de l'ajout d'un Employe: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div>
      {isLoading && <LoadingPage />}
      <div className="overflow-y-auto w-full h-full bg-opacity-90">
        <div className="p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
          <div className="bg-gray-200 rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
            Affecter Responsable
          </div>
          <div className="flex flex-wrap gap-6 justify-around">
            <div className="flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium">
                Choisir Responsable:
              </label>
              <ResponsableSearch onSelectEmployee={handleSelectEmployee} isMulti={false} />
            </div>
            <div className="flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium">
                Email:
              </label>
              <input
                type="email"
                className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium">
                Mot De Pass:
              </label>
              <input
                type="password"
                className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
            <div className="flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium">
                Sélectionner Employés:
              </label>
              <EmployeSearch onSelectEmployee={handleSelectEmployees} isMulti={true} />
            </div>
          </div>
          <div className='flex justify-center items-center'>
            <button
              onClick={SubmitProject}
              className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewEmployee;




// ? This is the code without the Search bar just remove the comments
// import React, { useState, useEffect } from 'react';
// import Select from 'react-select';
// import { db } from "../../firebase";
// import { v4 } from "uuid";
// import LoadingPage from "../../util/LoadingPage";
// import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword ,signOut } from "firebase/auth";
// import {
//   getDocs,
//   collection,
//   query,
//   addDoc,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { sucess_toast, error_toast } from "../../util/toastNotification";

// const NewEmployee = () => {
//   const EmployeCollectionRef = collection(db, "employe");
//   const ResponsableProjectCollectionRef = collection(db, "responsableProject");

//   const [isLoading, setIsLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [selectedEmployees, setSelectedEmployees] = useState([]);
//   const [responsableList, setResponsableList] = useState([]);
//   const [employeList, setEmployeList] = useState([]);
//   const [newResponsable, setNewResponsable] = useState("");

//   const auth = getAuth();

//   // const optionsEmploye = employeList.map((employe) => ({
//   //   value: employe.ID_EMPLOYE,
//   //   label: `${employe.NOM} ${employe.PRENOM}`,
//   // }));

//   // const optionsResponable = responsableList.map((responsable) => ({
//   //   value: responsable.ID_EMPLOYE,
//   //   label: `${responsable.NOM} ${responsable.PRENOM}`,
//   // }));

//   // const getEmployesList = async () => {
//   //   try {
//   //     const [responsableDocs, employeDocs] = await Promise.all([
//   //       getDocs(query(EmployeCollectionRef, where("role", "==", "responsable"))),
//   //       getDocs(query(EmployeCollectionRef, where("role", "==", "employe")))
//   //     ]);

//   //     setResponsableList(responsableDocs.docs.map(doc => doc.data()));
//   //     setEmployeList(employeDocs.docs.map(doc => doc.data()));
//   //   } catch (error) {
//   //     console.error("Error fetching employees:", error);
//   //     error_toast("Error fetching employees");
//   //   }
//   // };

//   // useEffect(() => {
//   //   getEmployesList();
//   // }, []);

//   const handleSubmit = async (RendomId, currentUser) => {
//     try {
//       // Create the new user
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const userUid = userCredential.user.uid;
  
//       // Sign out the newly created user
//       await signOut(auth);
  
//       // Sign the original user back in
//       await signInWithEmailAndPassword(auth, currentUser.email, currentUser.password);
  
//       // Add the document to the ResponsableProject collection
//       await addDoc(ResponsableProjectCollectionRef, {
//         id: RendomId,
//         ID_EMPLOYE: newResponsable,
//         email: email,
//         uid: userUid,
//         DATE_EFFET: new Date(),
//       });
  
//     } catch (error) {
//       console.error("Error creating user:", error);
//       error_toast("Error creating user");
//     }
//   };
  

//   const SubmitProject = async () => {
//     try {
//       setIsLoading(true);
  
//       // Save the current user's credentials
//       const currentUser = auth.currentUser;
//       const currentUserEmail = currentUser.email;
//       const currentUserPassword = password; 
      
//       console.log("currentUser",currentUser)
//       console.log("currentUserEmail",currentUserEmail)
//       console.log("currentUserPassword",currentUserPassword)

//       // This should be the original user's password
  
    
  
//       const RendomId = v4();
  
//       // Handle user creation and project submission
//       await handleSubmit(RendomId, { email: currentUserEmail, password: currentUserPassword });
  
//       const selectedEmployeesIds = selectedEmployees.map(select => select.value);
//       const employeeDocsQuery = query(
//         EmployeCollectionRef,
//         where("ID_EMPLOYE", "in", selectedEmployeesIds)
//       );
  
//       const employeDocs = await getDocs(employeeDocsQuery);
//       const updatePromises = employeDocs.docs.map(doc =>
//         updateDoc(doc.ref, { ID_RESPONSABLE: newResponsable })
//       );
  
//       await Promise.all(updatePromises);
  
//       setEmail("");
//       setPassword("");
//       setSelectedEmployee(null);
//       setSelectedEmployees([]);
  
//       sucess_toast("Responsable a été affecté avec succès");
  
//     } catch (error) {
//       console.error("Error submitting project:", error);
//       error_toast("Erreur lors de l'ajout d'un Employe");
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const searchForResponsable = async (value) => {
     
//     const employeeDocsQuery = getDocs(
//       EmployeCollectionRef,
//       where("NOM" == value)
//     );

//   } 

//   // const handleChangeEmploye = (selectedOption) => {
//   //   setSelectedEmployee(selectedOption);
//   //   setNewResponsable(selectedOption.value);
//   // };

//   // const handleChangeEmployes = (selectedOption) => {
//   //   setSelectedEmployees(selectedOption);
//   // };

//   return (
//     <div>
//       {isLoading && <LoadingPage />}
//       <div className="overflow-y-auto w-full h-full bg-opacity-90">
//         <div className="p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
//           <div className="bg-gray-200 rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
//             Affecter Responsable
//           </div>
//           <div className="flex flex-wrap gap-6 justify-around ">
//             <div className="flex flex-col justify-center items-center">
//               <label className="flex items-center gap-2 mb-5 text-lg font-medium">
//                 Choiser Responsable :
//               </label>
//               <input type='text' alt='text' name='text' onKeyDown={(e) => searchForResponsable(e.target.value) }/>
//               {/* <Select
//                 value={selectedEmployee}
//                 onChange={handleChangeEmploye}
//                 options={optionsResponable}
//                 className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
//               /> */}
//             </div>
//             <div className="flex flex-col justify-center items-center">
//               <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
//                 Email :
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
//                 onChange={(e) => setEmail(e.target.value)}
//                 value={email}
//               />
//             </div>
//             <div className="flex flex-col justify-center items-center">
//               <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
//                 Mot De Pass :
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
//                 onChange={(e) => setPassword(e.target.value)}
//                 value={password}
//               />
//             </div>
//             <div className="flex flex-col justify-center items-center">
//               <label className="flex items-center gap-2 mb-5 text-lg font-medium"> selectionner Employes:</label>
//               {/* <Select
//                 value={selectedEmployees}
//                 onChange={handleChangeEmployes}
//                 options={optionsEmploye}
//                 isMulti
//                 className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
//               /> */}
//             </div>
//           </div>
//           <div className="flex justify-center items-center">
//             <button
//               onClick={SubmitProject}
//               className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
//             >
//               Ajouté
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewEmployee;



// import React, { useState } from 'react';
// import {
//   sucess_toast,
//   error_toast,
// } from "../../util/toastNotification";
// import Select from 'react-select';            
// import { db } from "../../firebase";
// import { v4 } from "uuid";
// import LoadingPage from "../../util/LoadingPage";
// import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut} from "firebase/auth";
// import { useEffect } from 'react';
// import {
//   getDocs,
//   collection,
//   query, 
//   addDoc, 
//   updateDoc,
//   where,
// } from "firebase/firestore";

// const NewEmployee = () => {
//   const EmployeCollectionRef =  collection(db, "employe");
//   const ResponsableProjectCollectionRef =  collection(db, "responsableProject");

//     const [isLoading , setIsLoading] = useState("");
//     const [email , setEmail] = useState("");
//     const [password , setPassword] = useState("");
//     const [selectedEmployee , setSelectedEmployee] = useState("");
//     const [selectedEmployees , setSelectedEmployees] = useState("");
//     const [employeList , setEmployeList] = useState([]);
//     const [responsableList , setResponsableList] = useState([]);
//     const [newResponsable , setNewResponsable] = useState("");

    
//     const auth = getAuth();

//     const optionsEmploye = employeList.map((employe) => ({
//       value: employe.EMPLOYE_id,
//       label: employe.NOM_EMPLOYE + " " + employe.PRENOM_EMPLOYE, 
//     }));

//     const optionsResponable = responsableList.map((employe) => ({
//       value: employe.EMPLOYE_id,
//       label: employe.NOM_EMPLOYE + " " + employe.PRENOM_EMPLOYE, 
//     }));

//     const getEmployeList = async () => {
//       const data2 = await getDocs(
//         query(
//           EmployeCollectionRef,
//           where("role", "!=", "responsable")
//         )
//       );

      
//       const filteredData2 = data2.docs.map((doc)=>({
//         ...doc.data(),
//       }))
//       setEmployeList(filteredData2);

//     }

//     const getResponsableList = async () => {

//       const data2 = await getDocs(
//         query(
//           EmployeCollectionRef,
//           where("role", "==", "responsable")
//         )
//       );
// // ! Rediscuss this 
      
//       const filteredData2 = data2.docs.map((doc)=>({
//         ...doc.data(),
//       }))
//       setResponsableList(filteredData2);

//     }

//     useEffect(()=>{
//       getEmployeList();
//       getResponsableList();
//     },[]);


    

//     const handleSubmit = async (RendomId, currentUser) => {
//       try {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         const user = userCredential.user;
//         const userUid = user.uid; 
    
//         await addDoc(ResponsableProjectCollectionRef, {
//           id: RendomId,
//           EMPLOYE_id: newResponsable,
//           email: email,
//           uid: userUid, 
//           DATE_EFFET: new Date(),
//         });
    
//         // Sign out the newly created user
//         await signOut(auth);
    
//         // Sign the original user back in
//         await signInWithEmailAndPassword(auth, currentUser.email, currentUser.password);
    
//       } catch (error) {
//         console.error("Error creating user:", error);
//         error_toast("Error creating user");
//       }
//     };
    
//     const SubmitProject = async () => {
//       try {
//         setIsLoading(true); 
    
//         // Save the current user's credentials
//         const currentUser = auth.currentUser;
//         const currentUserEmail = currentUser.email;     

//         const currentUserPassword = currentUser.password;
      
    
//         // Confirm the password
//         await signInWithEmailAndPassword(auth, currentUserEmail, currentUserPassword);
    
//         const RendomId = v4();
    
//         await handleSubmit(RendomId, { email: currentUserEmail, password: currentUserPassword });
    
//         const Employeedoc = await getDocs(
//           query(
//             EmployeCollectionRef,
//             where("EMPLOYE_id", "==", newResponsable)
//           )
//         );   
    
//         const docRef = Employeedoc.docs.map(doc => doc.ref);
//         const flattenedDocEmploye = docRef.flat();
    
//         const UpdateEmployee = flattenedDocEmploye.map(async (doc)=>{
//           await updateDoc(doc, {
//             "role": "responsable",
//           });
//         });
    
//         await Promise.all(UpdateEmployee);
    
//         const selectedEmployeesIds = selectedEmployees;
    
//         const DocsofEmployees = await Promise.all(
//           selectedEmployeesIds.map(async (select) => {
//             const Employeedocs = await getDocs(
//               query(
//                 EmployeCollectionRef,
//                 where("EMPLOYE_id", "==", select.value)
//               )
//             );
//             return Employeedocs.docs.map(doc => doc.ref);
//           })
//         );
    
//         const flattenedDocs = DocsofEmployees.flat();
//         const Update = flattenedDocs.map(async (doc) => {
//           await updateDoc(doc, {
//             "IdResponsable": newResponsable,
//           });
//         });
    
//         await Promise.all(Update);
    
//         setEmail("");
//         setPassword("");
//         setSelectedEmployee("");
//         setSelectedEmployees("");
    
//         sucess_toast("Employe a été ajouté avec succès"); 
//         setIsLoading(false); 
        
//       } catch (err) {
//         console.error(err);
//         setIsLoading(false); 
//         error_toast("Erreur lors de l'ajout d'un Employe");
//       }
//     }
    


//       const handleChangeEmploye = (selectedOption) => {
//         setSelectedEmployee(selectedOption);
//         setNewResponsable(selectedOption.value);
//       };

//       const handleChangeEmployes = (selectedOption) => {
//         setSelectedEmployees(selectedOption);
//       };

//   return (
//     <div>
//         {isLoading && <LoadingPage /> }
//       <div className=" overflow-y-auto  w-full h-full   bg-opacity-90">
//       <div className=" p-8 my-8  rounded-lg shadow-lg bg-white mx-auto">
//         <div className=" bg-gray-200  rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
//           Affecter Responsable
//         </div>
//         <div className="flex flex-wrap gap-6 justify-around ">
//         <div className="flex flex-col justify-center items-center">
//                   <label className="flex items-center gap-2 mb-5 text-lg font-medium">
//                     Choiser Responsable :
//                   </label>
//                   <Select
//                     value={selectedEmployee}
//                     onChange={handleChangeEmploye}
//                     options={optionsResponable} 
//                     className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
//                   /> 
//                 </div>   
//                 <div className="flex flex-col justify-center items-center">
//                 <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
//                   Email :
//                 </label>
//                 <input
//                   type="email"
//                   id="email"
//                   className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
//                   onChange={(e)=> setEmail(e.target.value)}
//                   value={email}
//                 />
//               </div>
//                 <div className="flex flex-col justify-center items-center">
//                 <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
//                   Mot De Pass :
//                 </label>
//                 <input
//                   type="password"
//                   id="password"
//                   className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
//                   onChange={(e)=> setPassword(e.target.value)}
//                   value={password}
//                 />
//               </div>
//                 <div className="flex flex-col justify-center items-center">
//                   <label className="flex items-center gap-2 mb-5 text-lg font-medium"> selectionner Employes:</label>
//                   <Select
//                     value={selectedEmployees}
//                     onChange={handleChangeEmployes}
//                     options={optionsEmploye} 
//                     isMulti
//                     className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
//                   />
//                 </div>
//         </div>
//         <div className='flex justify-center items-center'>
//         <button
//           onClick={SubmitProject}
//           className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
//         >
//           Ajouté
//         </button>
//         </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default NewEmployee