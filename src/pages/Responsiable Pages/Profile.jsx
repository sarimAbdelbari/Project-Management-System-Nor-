import React, { useState, useEffect ,useRef } from "react";
import {
  getDocs,
  collection,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import Select from 'react-select';            
import { db } from "../../firebase";
import { getAuth, signOut } from 'firebase/auth';
import { SlCalender } from "react-icons/sl";

import {FaSignOutAlt} from 'react-icons/fa';  

import { v4 } from "uuid";
import { error_toast, info_toast, sucess_toast } from "../../util/toastNotification";
import Facture from "./Facture";
import Historic from "./Historic";
import LoadingPage from "../../util/LoadingPage";
import { useStateContext } from '../../contexts/ContextProvider';

const Profile = (props) => {
  const id = props.parameter;

  const ProjetCollectionRef = collection(db, "projet");
  const ResponsableCollectionRef = collection(db, "responsableProject");
  const EmployeeCollectionRef = collection(db, "employe");
  const CorpsEtatCollectionRef = collection(db, "corps_etat");
  const RendementEmployeCollectionRef = collection(db, "rendementEmploye");
  const ArticleCollectionRef = collection(db, "article");
  const StructureProjectCollectionRef =  collection(db, "structureProjet");
  
  const [isLoading , setIsLoading] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [corpsEtatList, setCorpsEtatList] = useState([]);
  const [employeList, setEmployeList] = useState([]);
  const [articleList, setArticleList] = useState([]);
  const [selectedOcupation2 , setSelectedOcupation2] = useState("");
  const [selectedOcupation3 , setSelectedOcupation3] = useState("");
  const [newEmploye , setNewEmploye] = useState("");
  const [employe , setEmploye] = useState("");
  const [newArticle , setNewArticle] = useState("");
  const [article, setArticle] = useState("");
  const [prixUnitaire , setPrixUnitaire] = useState("");
  const [quantite_Article , setQuantite_Article] = useState("");
  const [creeLe, setCreeLe] = useState("");
  const [date, setDate] = useState("");
  const [rendementEmploye, setRendementEmploye] = useState("");
  const [isDateInputVisible, setDateInputVisible] = useState(false);

  const { setShowFacture, showFacture } = useStateContext();
  const { showHistoric, setShowHistoric } = useStateContext();

  const dateInputRef = useRef(null);

  const optionsEmploye = employeList.map((employe) => ({
    value: employe.ID_EMPLOYE,
    label: employe.NOM + " " + employe.PRENOM, 
  }));

  const optionsArticle = articleList.map((article) => ({
    value: article.id,
    label: article.article, 
  }));

  const getResponiableByUid = async (id) => {
    try {
      if (id) {
        const data = await getDocs(
          query(ResponsableCollectionRef, where("uid", "==", id))
        );
  
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
        }));
        
              return filteredData;
      }
      else {
        console.log("id does not exist")
      }
    } catch (err) {
      console.error(err);
    }
  };
 
  // ! ******************************************************************************

const historyDate = async (value) => {
    try {

    setIsLoading(true)

    console.log("value",value);

    const RendementEmployeData = await getDocs(
      query(RendementEmployeCollectionRef,
      where("Date", "==", value)
    )
    );
    


    if(!RendementEmployeData.empty){
      const rendementEmployeefilteredData = RendementEmployeData?.docs.map((doc) => ({
        ...doc.data(),
      }));

 
      setRendementEmploye(rendementEmployeefilteredData)


      
      info_toast("there is an Rendement Employe")

      setShowHistoric(true);

    } else {

      info_toast("il n'y a aucun Rendement Employe à cette date")

    }

    setCreeLe(value);
    
  } catch (error) {
    console.error(error);
    setIsLoading(false)
    }
    finally {
      setIsLoading(false)
    }
  }
  // ! ******************************************************************************
  
  const fetchResponsiableInfo = async (id) => {
    const responsiableData = await getResponiableByUid(id);

    if(responsiableData) {
      const Data = responsiableData.map((doc) => ({
        idCoprs: doc.ID_CORPS,
        idProject: doc.ID_PROJETS,
        ID_RESPONSABLE: doc.ID_EMPLOYE,
      }));
      
      const EmployeData = await getDocs(
        query(EmployeeCollectionRef, where("ID_RESPONSABLE", "==", Data[0].ID_RESPONSABLE))
      );
  
      const EmployeefilteredData = EmployeData?.docs.map((doc) => ({
        ...doc.data(),
      }));
  
      setEmployeList(EmployeefilteredData);
  
  
      const ProjectData = await getDocs(
        query(ProjetCollectionRef, where("id", "==", Data[0].idProject))
      );
  
      const ProjectfilteredData = ProjectData?.docs.map((doc) => ({
        ...doc.data(),
      }));
  
      setProjectList(ProjectfilteredData);
  
      const corpsEtatData = await getDocs(
        query(CorpsEtatCollectionRef, where("id", "==", Data[0].idCoprs))
      );
  
      const corpsEtatfilteredData = corpsEtatData?.docs.map((doc) => ({
        ...doc.data(),
      }));
  
      setCorpsEtatList(corpsEtatfilteredData);
  
      const articleData = await getDocs(ArticleCollectionRef);
        const filteredData3 = articleData.docs.map((doc) => ({
          ...doc.data(),
        }));
        setArticleList(filteredData3);
  
    }
    else {
      console.log("your not assigned any Project")
    }
   
  };

  useEffect(() => {
    fetchResponsiableInfo(id);
  }, [id]);

  const handleChangeEmploye = (selectedOption) => {
    setSelectedOcupation2(selectedOption);
    setEmploye(selectedOption.label);
    setNewEmploye(selectedOption.value);
    console.log("Employe Selected ", selectedOption.value);
  };

  const getPrixByid = async(id) => {

    const data = await getDocs(
      query(StructureProjectCollectionRef, where("ID_ARTICLE", "==", id))
    );

    const filteredData = data?.docs.map((doc) => ({
      ...doc.data(),
    }));
   
    const Data = filteredData.map((doc) =>( {
      Prix: doc.PRIX_MOD,
    }));
  
    return Data[0]?.Prix;

  }
  
  const handleChangeArticle = async(selectedOption) => {
  
    const PrixUnitaire = await getPrixByid(selectedOption.value);
  
    setPrixUnitaire(PrixUnitaire)

    setSelectedOcupation3(selectedOption);
    setArticle(selectedOption.label)
    setNewArticle(selectedOption.value);
  };



  const SubmitRendementEmploye = async() =>{
     try {
      
        await addDoc(RendementEmployeCollectionRef, {
          id: v4(),
          ID_EMPLOYE: newEmploye,
          ID_PROJETS: projectList[0]?.id,
          ID_CORPS: corpsEtatList[0]?.id,
          ID_ARTICLE:newArticle,
          Prix_Unitaire:prixUnitaire,
          Quantite_Article: quantite_Article, 
          DATE_EFFET: new Date(),
          Date: date,
        });

        sucess_toast("RendementEmploye a été ajouté avec succès")
        setSelectedOcupation2("");
        setSelectedOcupation3("");
        setCreeLe("");
        setQuantite_Article("");
        setNewArticle("");
        setNewEmploye("");
      } catch (error) {
      console.log(error);
      error_toast("Erreur lors de l'ajout d'un RendementEmploye ");
    }
  }

  const handleButtonClick = () => {

    setDateInputVisible(!isDateInputVisible);

    if (dateInputRef.current) {
      dateInputRef.current.focus();
    }
  };

  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth);
    window.location.href = "/"; 
  };



  const PrintStructureProject = () => {
    setShowFacture(true);
  };

  return (
    <div>
    {showFacture && <Facture date={date} newEmploye={employe} quantite_Article={quantite_Article} prixUnitaire={prixUnitaire} newArticle={article} project={projectList[0]?.DESIGNATION_PROJET} corpsEtat={corpsEtatList[0]?.lib_corps} />}
    {showHistoric && <Historic rendementEmploye={rendementEmploye} project={projectList[0]?.DESIGNATION_PROJET} corpsEtat={corpsEtatList[0]?.lib_corps} />}
    {isLoading && <LoadingPage  />}

    <div className="overflow-y-auto min-h-screen h-full bg-gray-100 bg-opacity-90">
  <div className="w-4/6 p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
    <div className="bg-blue-900 relative flex justify-center items-center  rounded p-4 text-white text-2xl font-semibold mb-4 rounded-t-lg text-center">
    <button
  onClick={handleButtonClick}
  className="absolute top-3 left-3 bg-green-600 hover:bg-green-500 text-white text-2xl font-bold py-2 px-4 rounded"
>
  <SlCalender />
</button>
{isDateInputVisible && <input
  type="date"
  ref={dateInputRef}
  className="w-80 text-gray-800 absolute top-14 left-3 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600"
  onChange={(e) => historyDate(e.target.value)}
  value={creeLe}
/>}

     
      <h1 className="text-center">Responsable Projet</h1>
      <button
          className="absolute top-3 right-3 bg-green-600 hover:bg-green-500 text-white text-2xl font-semibold py-2 px-4 rounded"
          onClick={handleLogout}
      >
      <FaSignOutAlt />
      </button>
    </div>
      <div className="flex  flex-col justify-around items-center ">
        <p className="my-4 font-semibold text-gray-800 text-2xl">Projet:  {projectList[0]?.DESIGNATION_PROJET || "Vous n'êtes affecté à aucun projet"}</p>
        <p className="my-4 font-semibold text-gray-800 text-2xl">Corps Etat:  {corpsEtatList[0]?.lib_corps || " "}</p>
      </div>
    <div className="grid grid-cols-1 md:grid-cols-2 place-content-center  gap-6">
        <div className="my-2 flex flex-col  items-center justify-center">
          <label className="text-center   mb-5 text-lg font-medium">Employe :</label>
          <Select
            value={selectedOcupation2}
            onChange={handleChangeEmploye}
            options={optionsEmploye} 
            className='w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600'
          />
        </div>
        <div className="my-2 flex flex-col  items-center justify-center">
          <label className="text-center mb-5  text-lg font-medium">Article:</label>
          <Select
            value={selectedOcupation3}
            onChange={handleChangeArticle}
            options={optionsArticle} 
            className='w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600'
            />
        </div>
        
        <div className="my-2 flex flex-col  items-center justify-center">
          <label htmlFor="file" className="text-center  mb-5 text-lg font-medium">
            Quantite :
          </label>
          <input
            type="text"
            id="text"
            className=" w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600"
            onChange={(e)=> setQuantite_Article(e.target.value)}
            value={quantite_Article}
            />
        </div>
        <div className="my-1 flex flex-col  items-center justify-center">
          <p className="text-center mb-5  text-lg font-medium">Prix Unitaire : </p>
          <p className="border border-gray-400 rounded-md focus:outline-none focus:border-green-600 w-80 p-2 ">{prixUnitaire || "0"}</p>
        </div>
        <div className="my-2 flex flex-col  items-center justify-center">
          <label className="text-center  mb-5 text-lg font-medium ">
            Date :
          </label>
          <input
            type="date"
            className="w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600"
            onChange={(e) => setDate(e.target.value)}
            value={date}
            />
        </div>
      </div>
       
    <div className="flex justify-center items-center gap-3 text-center mt-4">
        <button
          className="bg-green-600 hover:bg-green-500 text-white font-semibold my-2 py-2 px-4 rounded"
          onClick={() => SubmitRendementEmploye()}
          >
          Rendement Employe
        </button>
        <button
          className="bg-green-600 hover:bg-green-500 text-white font-semibold my-2 py-2 px-4 rounded"
          // onClick={() => handlePrint()}
          onClick={() => PrintStructureProject()}
          >
          Imprimer 
        </button>
    </div>
            </div>
  </div>
</div>


  );
};

export default Profile;


// import React, { useState, useEffect } from "react";
// import {
//   getDocs,
//   collection,
//   query,
//   where,
//   addDoc,
// } from "firebase/firestore";
// import Select from 'react-select';            
// import { db } from "../../firebase";
// import { getAuth, signOut } from 'firebase/auth';

// import {FaSignOutAlt} from 'react-icons/fa';  

// import { v4 } from "uuid";
// import { error_toast, info_toast, sucess_toast } from "../../util/toastNotification";
// import Facture from "./Facture";
// import Historic from "./Historic";
// import LoadingPage from "../../util/LoadingPage";
// import { useStateContext } from '../../contexts/ContextProvider';

// const Profile = (props) => {
//   const id = props.parameter;

//   const ProjetCollectionRef = collection(db, "projet");
//   const ResponsableCollectionRef = collection(db, "responsableProject");
//   const EmployeeCollectionRef = collection(db, "employe");
//   const CorpsEtatCollectionRef = collection(db, "corps_etat");
//   const RendementEmployeCollectionRef = collection(db, "rendementEmploye");
//   const ArticleCollectionRef = collection(db, "article");
//   const StructureProjectCollectionRef =  collection(db, "structureProjet");
  
//   const [isLoading , setIsLoading] = useState(false);
//   const [projectList, setProjectList] = useState([]);
//   const [corpsEtatList, setCorpsEtatList] = useState([]);
//   const [employeList, setEmployeList] = useState([]);
//   const [articleList, setArticleList] = useState([]);
//   const [selectedOcupation2 , setSelectedOcupation2] = useState("");
//   const [selectedOcupation3 , setSelectedOcupation3] = useState("");
//   const [newEmploye , setNewEmploye] = useState("");
//   const [employe , setEmploye] = useState("");
//   const [newArticle , setNewArticle] = useState("");
//   const [article, setArticle] = useState("");
//   const [prixUnitaire , setPrixUnitaire] = useState("");
//   const [quantite_Article , setQuantite_Article] = useState("");
//   const [creeLe, setCreeLe] = useState("");

//   const { setShowFacture, showFacture } = useStateContext();
//   const { showHistoric, setShowHistoric } = useStateContext();


//   const optionsEmploye = employeList.map((employe) => ({
//     value: employe.ID_EMPLOYE,
//     label: employe.NOM + " " + employe.PRENOM, 
//   }));

//   const optionsArticle = articleList.map((article) => ({
//     value: article.id,
//     label: article.article, 
//   }));

//   const getResponiableByUid = async (id) => {
//     try {
//       if (id) {
//         const data = await getDocs(
//           query(ResponsableCollectionRef, where("uid", "==", id))
//         );
  
//         const filteredData = data.docs.map((doc) => ({
//           ...doc.data(),
//         }));
        
//               return filteredData;
//       }
//       else {
//         console.log("id does not exist")
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };
 
//   // ! ******************************************************************************
// const historyDate = async (value) => {
//     try {

//     setIsLoading(true)

    

//     const RendementEmployeData = await getDocs(
//       query(RendementEmployeCollectionRef,
//       where("Date", "==", value)
//     )
//     );
    


//     if(!RendementEmployeData.empty){
//       const rendementEmployeefilteredData = RendementEmployeData?.docs.map((doc) => ({
//         ...doc.data(),
//       }));
  
//       console.log("rendementEmployeefilteredData",rendementEmployeefilteredData);


//       setQuantite_Article(rendementEmployeefilteredData[0]?.Quantite_Article);

//       setPrixUnitaire(rendementEmployeefilteredData[0]?.Prix_Unitaire);
      
//       const dataEmploye = await getDocs(
//         query(EmployeeCollectionRef, where("ID_EMPLOYE", "==", rendementEmployeefilteredData[0]?.ID_EMPLOYE))
//       );

//       const filteredDataEmploye = dataEmploye.docs.map((doc) => ({
//         ...doc.data(),
//       }));
 
//       console.log("filteredDataEmploye",filteredDataEmploye);

//       const dataArticle = await getDocs(
//         query(ArticleCollectionRef, where("id", "==", rendementEmployeefilteredData[0]?.ID_ARTICLE))
//       );
      
//       const filteredDataArticle = dataArticle.docs.map((doc) => ({
//         ...doc.data(),
//       }));

//       console.log("filteredDataArticle",filteredDataArticle);

//       setSelectedOcupation2(rendementEmployeefilteredData[0]?.ID_EMPLOYE);
      
//       setSelectedOcupation3(rendementEmployeefilteredData[0]?.ID_ARTICLE);
      

//       setSelectedOcupation2({ value: filteredDataEmploye[0]?.ID_EMPLOYE, label: filteredDataEmploye[0].NOM + " " + filteredDataEmploye[0].PRENOM });

//       setSelectedOcupation3({ value: filteredDataArticle[0]?.id, label: filteredDataArticle[0]?.article });
      
//       info_toast("there is an Rendement Employe")

//     } else {

//       info_toast("il n'y a aucun Rendement Employe à cette date")

//     }

//     setCreeLe(value);
    
//   } catch (error) {
//     console.error(error);
//     setIsLoading(false)
//     }
//     finally {
//       setIsLoading(false)
//     }
//   }
//   // ! ******************************************************************************
  
//   const fetchResponsiableInfo = async (id) => {
//     const responsiableData = await getResponiableByUid(id);

//     if(responsiableData) {
//       const Data = responsiableData.map((doc) => ({
//         idCoprs: doc.ID_CORPS,
//         idProject: doc.ID_PROJETS,
//         ID_RESPONSABLE: doc.ID_EMPLOYE,
//       }));
      
//       const EmployeData = await getDocs(
//         query(EmployeeCollectionRef, where("ID_RESPONSABLE", "==", Data[0].ID_RESPONSABLE))
//       );
  
//       const EmployeefilteredData = EmployeData?.docs.map((doc) => ({
//         ...doc.data(),
//       }));
  
//       setEmployeList(EmployeefilteredData);
  
  
//       const ProjectData = await getDocs(
//         query(ProjetCollectionRef, where("id", "==", Data[0].idProject))
//       );
  
//       const ProjectfilteredData = ProjectData?.docs.map((doc) => ({
//         ...doc.data(),
//       }));
  
//       setProjectList(ProjectfilteredData);
  
//       const corpsEtatData = await getDocs(
//         query(CorpsEtatCollectionRef, where("id", "==", Data[0].idCoprs))
//       );
  
//       const corpsEtatfilteredData = corpsEtatData?.docs.map((doc) => ({
//         ...doc.data(),
//       }));
  
//       setCorpsEtatList(corpsEtatfilteredData);
  
//       const articleData = await getDocs(ArticleCollectionRef);
//         const filteredData3 = articleData.docs.map((doc) => ({
//           ...doc.data(),
//         }));
//         setArticleList(filteredData3);
  
//     }
//     else {
//       console.log("your not assigned any Project")
//     }
   
//   };

//   useEffect(() => {
//     fetchResponsiableInfo(id);
//   }, [id]);

//   const handleChangeEmploye = (selectedOption) => {
//     setSelectedOcupation2(selectedOption);
//     setEmploye(selectedOption.label);
//     setNewEmploye(selectedOption.value);
//     console.log("Employe Selected ", selectedOption.value);
//   };

//   const getPrixByid = async(id) => {

//     const data = await getDocs(
//       query(StructureProjectCollectionRef, where("ID_ARTICLE", "==", id))
//     );

//     const filteredData = data?.docs.map((doc) => ({
//       ...doc.data(),
//     }));
   
//     const Data = filteredData.map((doc) =>( {
//       Prix: doc.PRIX_MOD,
//     }));
  
//     return Data[0]?.Prix;

//   }
  
//   const handleChangeArticle = async(selectedOption) => {
  
//     const PrixUnitaire = await getPrixByid(selectedOption.value);
  
//     setPrixUnitaire(PrixUnitaire)

//     setSelectedOcupation3(selectedOption);
//     setArticle(selectedOption.label)
//     setNewArticle(selectedOption.value);
//   };



//   const SubmitRendementEmploye = async() =>{
//      try {
      
//         await addDoc(RendementEmployeCollectionRef, {
//           id: v4(),
//           ID_EMPLOYE: newEmploye,
//           ID_PROJETS: projectList[0]?.id,
//           ID_CORPS: corpsEtatList[0]?.id,
//           ID_ARTICLE:newArticle,
//           Prix_Unitaire:prixUnitaire,
//           Quantite_Article: quantite_Article, 
//           Date: creeLe, 
//           DATE_EFFET: new Date(),
//         });

//         sucess_toast("RendementEmploye a été ajouté avec succès")
//         setSelectedOcupation2("");
//         setSelectedOcupation3("");
//         setCreeLe("");
//         setQuantite_Article("");
//         setNewArticle("");
//         setNewEmploye("");
//       } catch (error) {
//       console.log(error);
//       error_toast("Erreur lors de l'ajout d'un RendementEmploye ");
//     }
//   }



//   const auth = getAuth();

//   const handleLogout = () => {
//     signOut(auth);
//     window.location.href = "/"; 
//   };



//   const PrintStructureProject = () => {
//     setShowFacture(true);
//   };

//   return (
//     <div>
//     {showFacture && <Facture newEmploye={employe} creeLe={creeLe} quantite_Article={quantite_Article} prixUnitaire={prixUnitaire} newArticle={article} project={projectList[0]?.DESIGNATION_PROJET} corpsEtat={corpsEtatList[0]?.lib_corps} />}
//     {showHistoric && <Historic/>}
//     {isLoading && <LoadingPage />}

//     <div className="overflow-y-auto min-h-screen h-full bg-gray-100 bg-opacity-90">
//   <div className="w-4/6 p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
//     <div className="bg-blue-900 relative flex justify-center items-center  rounded p-4 text-white text-2xl font-semibold mb-4 rounded-t-lg text-center">
//       <h1 className="text-center">Responsable Projet</h1>
//       <button
//           className="absolute top-3 right-3 bg-green-600 hover:bg-green-500 text-white text-2xl font-semibold py-2 px-4 rounded"
//           onClick={handleLogout}
//       >
//       <FaSignOutAlt />
//       </button>
//     </div>
//       <div className="flex  flex-col justify-around items-center ">
//         <p className="my-4 font-semibold text-gray-800 text-2xl">Projet:  {projectList[0]?.DESIGNATION_PROJET || "Vous n'êtes affecté à aucun projet"}</p>
//         <p className="my-4 font-semibold text-gray-800 text-2xl">Corps Etat:  {corpsEtatList[0]?.lib_corps || " "}</p>
//       </div>
//     <div className="grid grid-cols-1 md:grid-cols-2 place-content-center  gap-6">
//         <div className="my-2 flex flex-col  items-center justify-center">
//           <label className="text-center   mb-5 text-lg font-medium">Employe :</label>
//           <Select
//             value={selectedOcupation2}
//             onChange={handleChangeEmploye}
//             options={optionsEmploye} 
//             className='w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600'
//           />
//         </div>
//         <div className="my-2 flex flex-col  items-center justify-center">
//           <label className="text-center mb-5  text-lg font-medium">Article:</label>
//           <Select
//             value={selectedOcupation3}
//             onChange={handleChangeArticle}
//             options={optionsArticle} 
//             className='w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600'
//             />
//         </div>
        
//         <div className="my-2 flex flex-col  items-center justify-center">
//           <label htmlFor="file" className="text-center  mb-5 text-lg font-medium">
//             Quantite :
//           </label>
//           <input
//             type="text"
//             id="text"
//             className=" w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600"
//             onChange={(e)=> setQuantite_Article(e.target.value)}
//             value={quantite_Article}
//             />
//         </div>
//         <div className="my-1 flex flex-col  items-center justify-center">
//           <p className="text-center mb-5  text-lg font-medium">Prix Unitaire : </p>
//           <p className="border border-gray-400 rounded-md focus:outline-none focus:border-green-600 w-80 p-2 ">{prixUnitaire}</p>
//         </div>
//         <div className="my-2 flex flex-col  items-center justify-center">
//           <label className="text-center  mb-5 text-lg font-medium ">
//             Date :
//           </label>
//           <input
//             type="date"
//             className="w-80 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-green-600"
//             onChange={(e) => historyDate(e.target.value)}
//             value={creeLe}
//             />
//         </div>
//       </div>
       
//     <div className="flex justify-center items-center gap-3 text-center mt-4">
//         <button
//           className="bg-green-600 hover:bg-green-500 text-white font-semibold my-2 py-2 px-4 rounded"
//           onClick={() => SubmitRendementEmploye()}
//           >
//           Rendement Employe
//         </button>
//         <button
//           className="bg-green-600 hover:bg-green-500 text-white font-semibold my-2 py-2 px-4 rounded"
//           // onClick={() => handlePrint()}
//           onClick={() => PrintStructureProject()}
//           >
//           Imprimer 
//         </button>
//     </div>
//             </div>
//   </div>
// </div>


//   );
// };

// export default Profile;
