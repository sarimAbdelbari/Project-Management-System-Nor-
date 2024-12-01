import React, { useState, useEffect, useRef } from 'react';
import { getDocs, collection, query, where } from "firebase/firestore";
import { useReactToPrint } from 'react-to-print';
import { useStateContext } from "../../../contexts/ContextProvider";
import { db } from "../../../firebase";
import LoadingPage from "../../../util/LoadingPage";
import { IoIosCloseCircle } from "react-icons/io";

const Facture = (props) => {
  const { project, projectList, newArticle, corpsEtat, newCorpsEtat } = props;

  const [isLoading, setIsLoading] = useState("");
  const [articleDataList, setArticleDataList] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const { setShowFacture } = useStateContext();

  const StructureProjectEtatCollectionRef = collection(db, "structureProjet");
  const projectCollectionRef = collection(db, "projet");
  const articleCollectionRef = collection(db, "article");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const mergedArray = await structureProjects();
      setArticleDataList(mergedArray);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const structureProjects = async () => {
    const filteredProjectDocs = await getDocs(
      query(
        projectCollectionRef,
        where("id", "==", project)
      )
    );

    const ProjectDoc = filteredProjectDocs.docs.length > 0 ? filteredProjectDocs.docs[0].data() : {};
    setProjectData(ProjectDoc);

    const ArticlesIdData = Promise.all(corpsEtat.map(async (corps) => {
      const querySnapshot = await getDocs(
        query(
          StructureProjectEtatCollectionRef,
          where("ID_CORPS", "==", corps.id),
          where("ID_PROJETS", "==", project)
        )
      );
      const articlesData = querySnapshot.docs.map(doc => doc.data());
      return articlesData.length > 0 ? articlesData : null;
    }));

    const articlesIdData = await ArticlesIdData;

    const ArticleDataPromises = articlesIdData.map(async (ArticlesIdData) => {
      ArticlesIdData.map(async (ArticleId) => {
        const querySnapshot = await getDocs(
          query(
            articleCollectionRef,
            where("id", "==", ArticleId.ID_ARTICLE)
          )
        );
        const articlesData = querySnapshot.docs.map(doc => doc.data());
        return articlesData.length > 0 ? articlesData : null;
      });
      return ArticlesIdData;
    });

    const ArticleData = await Promise.all(ArticleDataPromises);

    const ArticleDataById = ArticleData.map(async (article) => {
      const articlesIds = article.map(async (article) => {
        const querySnapshot = await getDocs(
          query(
            articleCollectionRef,
            where("id", "==", article.ID_ARTICLE)
          )
        );
        const articlesData = querySnapshot.docs.map(doc => doc.data());
        return articlesData.length > 0 ? articlesData : null;
      });

      return await Promise.all(articlesIds.length > 0 ? articlesIds : null);
    });

    const ArticleDataByIds = await Promise.all(ArticleDataById);
    const ArticleDataByIdsPromiseData = await Promise.all(ArticleDataByIds);
    const flatenedArray = ArticleDataByIdsPromiseData.map((article) => article.flat());
    const structureProjectdetails = flatenedArray.flat();

    const structureProjectData = await Promise.all(structureProjectdetails.map(async (ArticleData) => {
      const querySnapshot = await getDocs(
        query(
          StructureProjectEtatCollectionRef,
          where("ID_ARTICLE", "==", ArticleData.id)
        )
      );
      return querySnapshot.docs.length > 0 ? querySnapshot.docs[0].data() : {};
    }));

    const mergeArrays = (arrayOfArray, detailsArray) => {
      return arrayOfArray.map((nestedArray, index) => {
        return nestedArray.map((obj, idx) => {
          return { ...obj, ...detailsArray[idx] };
        });
      });
    };

    const mergedArray = mergeArrays(flatenedArray, structureProjectData);
    return mergedArray;
  }

  const closeModule = () => {
    setShowFacture(false);
  };

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const isEmpty = (arr) => {
    return arr.length === 0;
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="fixed z-40 top-0 overflow-y-auto left-0 w-full h-full bg-black bg-opacity-90">
      <div className="w-4/6 p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
        <div className="bg-gray-800 rounded p-4 text-white text-2xl font-semibold mb-4 rounded-t-lg text-center">
          Structure Projet
          <button
            className="float-right text-gray-300 hover:text-gray-500"
            onClick={closeModule}
          >
            <IoIosCloseCircle />
          </button>
        </div>
        <div style={{ pageBreakBefore: "always" }} className="flex justify-center flex-col items-center">
          <div id="PageToPrint" ref={printRef} className="w-full mb-4 ">
            <div className='flex flex-col justify-center items-center text-center'>
              {projectList && !project &&
                <div className='w-full border border-gray-700 flex flex-col gap-1'>
                  <label className='text-lg border border-gray-700 px-1 py-1 font-semibold text-gray-950'>Projects :</label>
                  <TableRow
                    value={projectList.map((project) => (<> {project.DESIGNATION_PROJET} <br /></>)) || " "} />
                </div>
              }
              {project &&
                <>
                  <div className='w-full text-center justify-center items-center flex border-2 border-gray-700'>
                    <label className='text-lg font-semibold text-gray-950 px-1 py-1'>Project :</label>
                    <TableRow className='text-lg text-center font-semibold text-gray-800' value={projectData.DESIGNATION_PROJET || " "} />
                  </div>
                </>
              }

              {!isEmpty(corpsEtat) &&
                <div className='w-full flex flex-col justify-center items-center gap-2 border border-gray-700'>
                  <label className='w-full border-b-2 px-1 py-1 border-gray-700 text-lg font-semibold text-gray-950'>Corps Etats :</label>
                  <TableRow value={
                    corpsEtat.map((corps, index) => (
                      <div key={index} >
                        <p className='text-lg font-medium text-gray-800 text-center py-1 px-2 mb-2 mt-3'>{corps.lib_corps}</p>
                        <div className='flex flex-col justify-center items-center'>
                          {newCorpsEtat && articleDataList[index] &&
                            <div className='w-full flex flex-wrap justify-evenly text-center items-center'>
                              <label className='p-3 w-32 border-gray-700 border' >Article</label>
                              {newArticle && <>
                                <label className='p-3 w-32 border-gray-700 border'>Prix</label>
                                <label className='p-3 w-32 border-gray-700 border'>Quantite</label></>}
                            </div>
                          }
                          <div>
                            {newCorpsEtat && articleDataList[index] && articleDataList[index].map((article, subIndex) => (
                              <div className='w-full flex flex-wrap justify-evenly text-center items-center'>
                                <p key={article} className='p-3 w-32 border-gray-700 border flex-grow text-md font-medium text-black '>{article.article} </p>
                                {newArticle && <>
                                  <p key={article} className='p-3 w-32 border-gray-700 border flex-grow text-md font-medium text-black '> {article.PRIX_MOD}</p>
                                  <p key={article} className='p-3 w-32 border-gray-700 border flex-grow text-md font-medium text-black '>{article.QUANTITE_ARTICLE}</p></>}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  } />
                </div>
              }
            </div>
          </div>
          <div className="text-center">
            <p className="text-md text-gray-600">
              Date d'impression: {new Date().toLocaleDateString()} , {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            onClick={handlePrint}
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ label, value }) => (
  <tr className='px-4 py-2'>
    <td className="text-center font-semibold text-gray-800">{label}</td>
    <td className="text-left ">{value}</td>
  </tr>
);

export default Facture;
