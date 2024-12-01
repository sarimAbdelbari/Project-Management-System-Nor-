import { useState ,useEffect } from 'react';
import {
  sucess_toast,
  error_toast,
} from "../../../util/toastNotification";
import {
  getDocs,
  collection,
  addDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";
import { v4 } from "uuid";
import LoadingPage from "../../../util/LoadingPage";
import Select from "react-select";


const NewStructureProject = () => {
  
  const [isLoading , setIsLoading] = useState("");
  
  const [projectList , setProjectList] = useState([]);
  const [corpsEtatList , setCorpsEtatList] = useState([]);
  const [articleList , setArticleList] = useState([]);

  const [newProject , setNewProject] = useState("");
  const [NewCorpsEtat , setNewCorpsEtat] = useState("");
  const [NewArticle , setNewArticle] = useState("");
  const [quantite_Article , setQuantite_Article] = useState("");
  const [prix , setPrix] = useState("");
  const [creeLe , setCreeLe] = useState("");

  const [selectedOcupation1 , setSelectedOcupation1] = useState("");
  const [selectedOcupation3 , setSelectedOcupation3] = useState("");
  const [selectedOcupation4 , setSelectedOcupation4] = useState("");
  
  const StructureProjectEtatCollectionRef =  collection(db, "structureProjet");
  const projectCollectionRef = collection(db, "projet");
  const corpsEtatCollectionRef = collection(db, "corps_etat");
  const articleCollectionRef = collection(db, "article");

  const optionsProject = projectList.map((project) => ({
      value: project.id,
      label: project.DESIGNATION_PROJET, 
  }));
 
  const optionsCorpsEtat = corpsEtatList.map((corpsEtat) => ({
      value: corpsEtat.id,
      label: corpsEtat.lib_corps, 
  }));
  const optionsArticle = articleList.map((article) => ({
      value: article.id,
      label: article.article, 
  }));

  const getInfoList = async () => {
    try {
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
      const data4 = await getDocs(articleCollectionRef);
      const filteredData4 = data4.docs.map((doc) => ({
        ...doc.data(),
      }));
      setArticleList(filteredData4);

    } catch (err) {
      console.error(err);
    } 
  };

  useEffect(() => {
    getInfoList();
  },[]);

  const SubmitStructureProject = async () => {
    try {
      setIsLoading(true); 


      await addDoc(StructureProjectEtatCollectionRef, {
        id: v4(),
        ID_PROJETS: newProject,
        ID_CORPS: NewCorpsEtat,
        ID_ARTICLE: NewArticle,
        QUANTITE_ARTICLE: quantite_Article,
        PRIX_MOD: prix,
        Cree_Le: creeLe,
        DATE_EFFET:new Date(),
      });

      
      setSelectedOcupation1("");
      setSelectedOcupation3("");
      setSelectedOcupation4("");
      setQuantite_Article("");
      setPrix("");
      setCreeLe("");

      sucess_toast("StructureProject a été ajouté avec succès"); 

      setIsLoading(false); 

    } catch (err) {
      console.error(err);
      error_toast("Erreur lors de l'ajout d'un StructureProject");
    }
  }


  const handleChangeProject = (selectedOption) => {
    setSelectedOcupation1(selectedOption);
    setNewProject(selectedOption.value);
  };
  const handleChangeCorpsEtat = (selectedOption) => {
    setSelectedOcupation3(selectedOption);
    setNewCorpsEtat(selectedOption.value);
  };
  const handleChangeArticle = (selectedOption) => {
    setSelectedOcupation4(selectedOption);
    setNewArticle(selectedOption.value);
  };

  return (
    <div>
        {isLoading && <LoadingPage /> }
      <div className=" overflow-y-auto  w-full h-full   bg-opacity-90">
      <div className=" p-8 my-8  rounded-lg shadow-lg bg-white mx-auto">
        <div className=" bg-gray-200  rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
            Cree Structure Projet
        </div>
        <div className="flex flex-wrap gap-2  justify-around">
                <div className="flex flex-col justify-center items-center">
                  <label className="flex items-center  mb-5 text-lg font-medium">project:</label>
                  <Select
                    value={selectedOcupation1}
                    onChange={handleChangeProject}
                    options={optionsProject} 
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <label className="flex items-center  mb-5 text-lg font-medium">CorpsEtat:</label>
                  <Select
                    value={selectedOcupation3}
                    onChange={handleChangeCorpsEtat}
                    options={optionsCorpsEtat} 
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <label className="flex items-center  mb-5 text-lg font-medium">Article:</label>
                  <Select
                    value={selectedOcupation4}
                    onChange={handleChangeArticle}
                    options={optionsArticle} 
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                </div>

                <div className="flex flex-col justify-center items-center">
                  <label htmlFor="file" className="flex items-center  mb-5 text-lg font-medium">
                    Quantite Article :
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setQuantite_Article(e.target.value)}
                    value={quantite_Article}
                  />
                </div>
                <div className="flex flex-col justify-center items-center">
                  <label htmlFor="file" className="flex items-center  mb-5 text-lg font-medium">
                    Prix :
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setPrix(e.target.value)}
                    value={prix}

                  />
                </div>
                <div className="flex flex-col justify-center items-center">
              <label className="flex items-center  mb-5 text-lg font-medium ">
                Date debut:
              </label>
              <input
                type="date"
                className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                onChange={(e) => setCreeLe(e.target.value)}
                value={creeLe}
              />
        </div>
        </div>
        <div className='flex justify-center items-center'>
        <button
                  onClick={SubmitStructureProject}
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

export default NewStructureProject;