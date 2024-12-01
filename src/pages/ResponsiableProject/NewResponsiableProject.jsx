import { useState ,useEffect } from 'react';
import {
  sucess_toast,
  error_toast,
} from "../../util/toastNotification";
import {
  getDocs,
  collection,
  query, 
  where,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";
import LoadingPage from "../../util/LoadingPage";
import Select from "react-select";

const NewResponsiableProject = () => {
    const [isLoading , setIsLoading] = useState("");
  
    const [projectList , setProjectList] = useState([]);
    const [employeList , setEmployeList] = useState([]);
    const [corpsEtatList , setCorpsEtatList] = useState([]);
    
  
    const [newProject , setNewProject] = useState("");
    const [NewEmployee , setNewEmploye] = useState("");
    const [NewCorpsEtat , setNewCorpsEtat] = useState("");
  
    const [selectedOcupation1 , setSelectedOcupation1] = useState("");
    const [selectedOcupation2 , setSelectedOcupation2] = useState("");
    const [selectedOcupation3 , setSelectedOcupation3] = useState("");
    
    const ResponsableProjectCollectionRef =  collection(db, "responsableProject");
    const projectCollectionRef = collection(db, "projet");
    const employeCollectionRef = collection(db, "employe");
    const corpsEtatCollectionRef = collection(db, "corps_etat");

 
    const optionsProject = projectList.map((project) => ({
        value: project.id,
        label: project.DESIGNATION_PROJET, 
    }));
    const optionsEmploye = employeList.map((employe) => ({
        value: employe.ID_EMPLOYE,
        label: employe.NOM + " " + employe.PRENOM, 
    }));
    const optionsCorpsEtat = corpsEtatList.map((corpsEtat) => ({
        value: corpsEtat.id,
        label: corpsEtat.lib_corps, 
    }));

    const getInfoList = async () => {
        try {

          const data = await getDocs(ResponsableProjectCollectionRef)

          const filteredData = data.docs.map((doc)=>({
            ...doc.data(),
          }))

          const EmployesIds = filteredData.map((data)=>{
            return data.ID_EMPLOYE;
          })

          const data2 = await getDocs(
            query(
              employeCollectionRef,
              where("ID_EMPLOYE", "in", EmployesIds) 
            )
          )
      
          const filteredData2 = data2.docs.map((doc)=>({
            ...doc.data(),
          }))

          setEmployeList(filteredData2);


          const data1 = await getDocs(projectCollectionRef);
          const filteredData1 = data1.docs.map((doc) => ({
            ...doc.data(),
          }));
          setProjectList(filteredData1);

          

    
    
          const data3 = await getDocs(corpsEtatCollectionRef);
          const filteredData3 = data3.docs.map((doc) => ({
            ...doc.data(),
          }));
          setCorpsEtatList(filteredData3);

        } catch (err) {
          console.error(err);
        } 
      };
    
      useEffect(() => {
        getInfoList();
      },[]);

      const getResponsableById = async (NewEmployee) => {
        const querySnapshot = await getDocs(
            query(
                ResponsableProjectCollectionRef,
                where("ID_EMPLOYE", "==", NewEmployee)
            )
        );
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].ref;
        } else {
            return null; 
        }
    }

    const SubmitResponsiableProject = async () => {
        try {
            setIsLoading(true); 
      
            const ResponsableDoc = await getResponsableById(NewEmployee);
      

            let updatedData = {
              ID_PROJETS: newProject,
              ID_CORPS: NewCorpsEtat,
              DATE_EFFET: new Date(),
            };

            await updateDoc(ResponsableDoc, updatedData);


            setSelectedOcupation1("");
            setSelectedOcupation2("");
            setSelectedOcupation3("");
      
            sucess_toast("Responsable Project a été ajouté avec succès"); 
      
            setIsLoading(false); 
      
          } catch (err) {
            console.error(err);
            error_toast("Erreur lors de l'ajout d'un Responsable Project");
          }
    }


    const handleChangeProject = (selectedOption) => {
        setSelectedOcupation1(selectedOption);
        setNewProject(selectedOption.value);
      };
      const handleChangeEmploye = (selectedOption) => {
        setSelectedOcupation2(selectedOption);
        setNewEmploye(selectedOption.value);
      };
      const handleChangeCorpsEtat = (selectedOption) => {
        setSelectedOcupation3(selectedOption);
        setNewCorpsEtat(selectedOption.value);
      };
  return (
    <div>
        {isLoading && <LoadingPage /> }
      <div className=" overflow-y-auto  w-full h-full   bg-opacity-90">
      <div className=" p-8 my-8  rounded-lg shadow-lg bg-white mx-auto">
        <div className=" bg-gray-200  rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
            Créer Responsable  Projet
        </div>
        <div className="flex flex-wrap gap-6 justify-around">
                <div className="mx-7 flex flex-col justify-center items-center">
                  <label className="flex items-center gap-2 mb-5 text-lg font-medium">project:</label>
                  <Select
                    value={selectedOcupation1}
                    onChange={handleChangeProject}
                    options={optionsProject} 
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                </div>
                <div className="mx-7 flex flex-col justify-center items-center">
                  <label className="flex items-center gap-2 mb-5 text-lg font-medium">CorpsEtat:</label>
                  <Select
                    value={selectedOcupation3}
                    onChange={handleChangeCorpsEtat}
                    options={optionsCorpsEtat} 
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                </div>
                <div className="mx-7 flex flex-col justify-center items-center">
                  <label className="flex items-center gap-2 mb-5 text-lg font-medium">Responsable:</label>
                  <Select
                    value={selectedOcupation2}
                    onChange={handleChangeEmploye}
                    options={optionsEmploye} 
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                </div>
        </div>
        <div className='flex justify-center items-center'>
        <button
                  onClick={SubmitResponsiableProject}
                  className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
                >
                  Ajouté
                </button>

        </div>
        </div>
      </div>
    </div>
  )
}

export default NewResponsiableProject