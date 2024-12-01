import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  query, where
} from "firebase/firestore";
import { db } from "../../firebase";
import { useStateContext } from '../../contexts/ContextProvider';
import Facture from './CRUD/Facture';
import LoadingPage from "../../util/LoadingPage";
import Select from "react-select";

const StructureProject = () => {
  const StructureProjectCollectionRef = collection(db, "structureProjet");
  const ProjetCollectionRef = collection(db, "projet");
  const CorpsEtatCollectionRef = collection(db, "corps_etat");
  const ArticleCollectionRef = collection(db, "article");

  const { setShowFacture, showFacture } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);


  const [structureProjectList, setStructureProjectList] = useState([]);


  const [projectList, setProjectList] = useState([]);
  const [corpsEtatList, setCorpsEtatList] = useState([]);
  const [articleList, setArticleList] = useState([]);


  const [selectedOcupation1, setSelectedOcupation1] = useState("");
  const [selectedOcupation2, setSelectedOcupation2] = useState("");
  const [selectedOcupation3, setSelectedOcupation3] = useState("");

  const [newProject, setNewProject] = useState("");
  const [newCorpsEtat, setNewCorpsEtat] = useState("");
  const [newArticle, setNewArticle] = useState("");

  const optionsProject = projectList.slice().sort((a, b) => a.DESIGNATION_PROJET.localeCompare(b.DESIGNATION_PROJET)).map((project) => ({
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

  const fetchProjectInfo = async () => {
    try {
      const structureData = await getDocs(StructureProjectCollectionRef);
      const idList = structureData.docs.map((doc) => doc.data().ID_PROJETS);

      const uniqueIdList = [...new Set(idList)];

      const projectData = await Promise.all(uniqueIdList.map(async (id) => {
        const querySnapshot = await getDocs(
          query(
            ProjetCollectionRef,
            where("id", "==", id)
          )
        );
        return querySnapshot.docs.map(doc => doc.data());
      }));

      const projects = projectData.flat();

      setProjectList(projects);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectClick = (selectedOption) => {

    setSelectedOcupation1(selectedOption);
    setSelectedOcupation2("");
    setSelectedOcupation3("");

    setNewCorpsEtat("");
    setNewArticle("");

    setNewProject(selectedOption);
    fetchCorpsEtatInfo(selectedOption);
  };

  const handleChangeProject = (selectedOption) => {

    setSelectedOcupation1(selectedOption);
    setSelectedOcupation2("");
    setSelectedOcupation3("");
  
    setNewCorpsEtat("");
    setNewArticle("");
    
    setNewProject(selectedOption.value);
    fetchCorpsEtatInfo(selectedOption.value);
  };

  const fetchCorpsEtatInfo = async (Id) => {
    try {

      const IdCopsEtatdata2 = await getDocs(
        query(
          StructureProjectCollectionRef,
          where("ID_PROJETS", "==", Id)
        )
      );

      const idList = IdCopsEtatdata2.docs.map((doc) => doc.data().ID_CORPS);

      const uniqueIdList = [...new Set(idList)];


      const CorpsEtatData = await Promise.all(uniqueIdList.map(async (id) => {
        const querySnapshot = await getDocs(
          query(
            CorpsEtatCollectionRef,
            where("id", "==", id)
          )
        );
        return querySnapshot.docs.map(doc => doc.data());
      }));

      const CorpsEtat = CorpsEtatData.flat();

      setCorpsEtatList(CorpsEtat);



    } catch (error) {
      console.error(error);
    }
  }

  const handleChangeCorpsEtat = (selectedOption) => {

    setSelectedOcupation2(selectedOption);
    setSelectedOcupation3("");
    setNewArticle("");

    setNewCorpsEtat(selectedOption.value);
    fetchArticleInfo(selectedOption.value);
  };

  const handleClickCorpsEtat = (selectedOption) => {

    setSelectedOcupation2(selectedOption);
    setSelectedOcupation3("");

    setNewCorpsEtat("");
    setNewArticle("");

    setNewCorpsEtat(selectedOption);
    fetchArticleInfo(selectedOption);
  };

  const fetchArticleInfo = async (Id) => {
    try {
      const IdCopsEtatdata2 = await getDocs(
        query(
          StructureProjectCollectionRef,
          where("ID_CORPS", "==", Id),
          where("ID_PROJETS", "==", newProject)
        )
      );
  
      const idList = IdCopsEtatdata2.docs.map((doc) => doc.data().ID_ARTICLE);
  
      const uniqueIdList = [...new Set(idList)];
  
      const ArticleData = await Promise.all(uniqueIdList.map(async (id) => {
        const querySnapshot = await getDocs(
          query(
            ArticleCollectionRef,
            where("id", "==", id)
          )
        );
        return querySnapshot.docs.map(doc => doc.data());
      }));
  
      const articles = ArticleData.flat();
      setArticleList(articles);
  
      // Fetch structure project data for each article
      const structureProjectData = await Promise.all(articles.map(async (article) => {
        const querySnapshot = await getDocs(
          query(
            StructureProjectCollectionRef,
            where("ID_ARTICLE", "==", article.id),
            where("ID_CORPS", "==", Id),
            where("ID_PROJETS", "==", newProject)
          )
        );
        if (!querySnapshot.empty) {
          return querySnapshot.docs.map(doc => doc.data());
        } else {
          return null;
        }
      }));
  
      const filteredStructureProjectData = structureProjectData.flat().filter(Boolean);

      console.log("filteredStructureProjectData", filteredStructureProjectData);
      setStructureProjectList(filteredStructureProjectData);
  
    } catch (error) {
      console.log(error);
    }
  };
  

  const handleChangeArticle = (selectedOption) => {
    setSelectedOcupation3(selectedOption);
    setNewArticle(selectedOption.value);
  };

  const handleClickArticle = (selectedOption) => {

    setSelectedOcupation3(selectedOption);

    setNewArticle(selectedOption);
  };
  
  useEffect(() => {
    fetchProjectInfo();
  }, []);

  const PrintStructureProject = () => {
    setShowFacture(true);
  };

  return (
    <div>
      {isLoading && <LoadingPage />}
      {showFacture && <Facture project={newProject} projectList={projectList} newCorpsEtat={newCorpsEtat}  corpsEtat={corpsEtatList} newArticle={newArticle} article={articleList} />}
      <div className=" overflow-y-auto  w-full  h-full   bg-opacity-90">
        <div className=" p-8 my-8 min-h-screen rounded-lg shadow-lg bg-white mx-auto">
          <div className=" bg-gray-200  rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
            Structure Projet
          </div>
          <div className="flex justify-evenly items-start">
          <div className="flex flex-wrap justify-center ">
           <div>

           <table className="table-auto m-4 ">
              <thead>
                <tr>
                  <th className="bg-gray-200 rounded px-4 py-2 text-lg font-medium">Projet</th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll max-h-80 focus:outline-none focus:border-[#54ad34]">
                  <tr>
                  <Select
                    value={selectedOcupation1}
                    onChange={handleChangeProject}
                    options={optionsProject} 
                    isSearchable 
                    placeholder="Rechercher un projet"
                    className='min-w-64 focus:outline-none focus:border-[#54ad34]'
                    />
                    </tr>
                {projectList
                  .slice() // Create a copy of the array to avoid mutating the original array
                  .sort((a, b) => a.DESIGNATION_PROJET.localeCompare(b.DESIGNATION_PROJET)) // Sort the array alphabetically based on DESIGNATION_PROJET
                  .map(project => (
                    <tr key={project.id}
                     onClick={() => handleProjectClick(project.id)} 
                     className={`cursor-pointer hover:bg-gray-200 ${selectedOcupation1 === project.id ? 'bg-[#54ad34] text-white font-medium' : ''}`}>
                      <td className="px-4  border-gray-400 rounded-md py-2 mb-2 border border-t-0">{project.DESIGNATION_PROJET}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {!newProject && <>
            <div className='flex justify-center items-center'>
              <button
                onClick={PrintStructureProject}
                className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
              >
                Print
              </button>

            </div>
          </>}
          
           </div>
           <div>
           {newProject &&
           <table className="table-auto m-4 ">
              <thead>
                <tr>
                  <th className="bg-gray-200 rounded px-4 py-2 text-lg font-medium">CorpsEtat:</th>
                </tr>
              </thead>
              <tbody className="overflow-y-scroll max-h-80 focus:outline-none focus:border-[#54ad34]">
                  <tr>
                  <Select
                    value={selectedOcupation2}
                    onChange={handleChangeCorpsEtat}
                    options={optionsCorpsEtat}
                    isSearchable 
                    placeholder="Rechercher un Corps Etat"
                    className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
                  />
                  </tr>
                  {corpsEtatList
                  .slice() // Create a copy of the array to avoid mutating the original array
                  .sort((a, b) => a.lib_corps.localeCompare(b.lib_corps)) // Sort the array alphabetically based on DESIGNATION_PROJET
                  .map(project => (
                    <tr key={project.id}
                     onClick={() => handleClickCorpsEtat(project.id)} 
                     className={`cursor-pointer hover:bg-gray-200 ${selectedOcupation2 === project.id ? 'bg-[#54ad34] text-white font-medium' : ''}`}>
                      <td className="px-4  border-gray-400 rounded-md py-2 mb-2 border border-t-0">{project.lib_corps}</td>
                    </tr>
                  ))}
              </tbody>
              {!newCorpsEtat && <>
              <button
                onClick={PrintStructureProject}
                className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
              >
                Print
              </button>
              </>}
            </table>
            }
           </div>
           <div>
  {newCorpsEtat &&
    <table className="table-auto m-4">
      <thead>
        <tr>
          
          <th className="bg-gray-200  px-4 py-2 text-lg font-medium">Article:</th>
          <th className="bg-gray-200  px-4 py-2 text-lg font-medium">Quantite</th>
          <th className="bg-gray-200  px-4 py-2 text-lg font-medium">Prix</th>
        </tr>
      </thead>
      <tbody className="overflow-y-scroll m-4 max-h-80 focus:outline-none focus:border-[#54ad34]">
        <tr className="w-full">
          <td className="w-full">

        <Select
            value={selectedOcupation3}
            onChange={handleChangeArticle}
            options={optionsArticle}
            isSearchable
            placeholder="Rechercher un Article"
            className='min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]'
            />
            </td>
          <td className="w-full bg-gray-200">
          </td>
          <td className="w-full bg-gray-200">
          </td>           
        </tr>
        {articleList.map(article => {
          const structureProject = structureProjectList.find(sp => sp.ID_ARTICLE === article.id);
          return (
            <tr key={article.id}
              onClick={() => handleClickArticle(article.id)}
              className={`cursor-pointer hover:bg-gray-200 ${selectedOcupation3 === article.id ? 'bg-[#54ad34] text-white font-medium' : ''}`}>
              <td className="px-4 border-gray-400 rounded-md py-2 mb-2 border border-t-0">{article.article}</td>
              <td className="px-4 border-gray-400 rounded-md py-2 mb-2 border border-t-0">{structureProject ? structureProject.QUANTITE_ARTICLE : 'N/A'}</td>
              <td className="px-4 border-gray-400 rounded-md py-2 mb-2 border border-t-0">{structureProject ? structureProject.PRIX_MOD : 'N/A'}</td>
            </tr>
          );
        })}
        {newCorpsEtat && !newArticle && <>
              <button
                onClick={PrintStructureProject}
                className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
              >
                Print
              </button>
              </>}
      </tbody>
    </table>
  }
</div>
          </div>
          </div>
          {newProject && newCorpsEtat && newArticle && <>
            <div className='flex justify-center items-center'>
              <button
                onClick={PrintStructureProject}
                className="rounded-md py-2 px-5 bg-[#6CC94B] hover:bg-[#54ad34] text-white font-bold cursor-pointer mt-4 disabled:bg-opacity-40"
              >
                Print
              </button>
            </div>
          </>}

        </div>
      </div>
    </div>
  )
}

export default StructureProject

