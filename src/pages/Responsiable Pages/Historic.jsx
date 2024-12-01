import React, { useEffect, useRef, useState } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { useReactToPrint } from 'react-to-print';
import { useStateContext } from '../../contexts/ContextProvider';
import { db } from "../../firebase";
import { getDocs, query, where ,collection } from 'firebase/firestore';

const Historic = (props) => {
  const { rendementEmploye, corpsEtat, project } = props;
  const { setShowHistoric } = useStateContext();
  const [employeeNames, setEmployeeNames] = useState({});
  const [articleNames, setArticleNames] = useState({});

  const EmployeeCollectionRef = collection(db, "employe");
  const ArticleCollectionRef = collection(db, "article");

  const closeModule = () => {
    setShowHistoric(false);
  };

  const RendementEmploye = async () => {
    const employeeNamesTemp = {};
    const articleNamesTemp = {};

    for (let rendement of rendementEmploye) {
      if (rendement.ID_EMPLOYE && !employeeNames[rendement.ID_EMPLOYE]) {
        const dataEmploye = await getDocs(
          query(EmployeeCollectionRef, where("ID_EMPLOYE", "==", rendement.ID_EMPLOYE))
        );

        const filteredDataEmploye = dataEmploye.docs.map((doc) => doc.data());
        if (filteredDataEmploye.length > 0) {
          const employee = filteredDataEmploye[0];
          employeeNamesTemp[rendement.ID_EMPLOYE] = `${employee.NOM}    ${employee.PRENOM}`; // Assuming employee document has 'firstName' and 'lastName' fields
        }
      }

      if (rendement.ID_ARTICLE && !articleNames[rendement.ID_ARTICLE]) {
        const dataArticle = await getDocs(
          query(ArticleCollectionRef, where("id", "==", rendement.ID_ARTICLE))
        );

        const filteredDataArticle = dataArticle.docs.map((doc) => doc.data());
        if (filteredDataArticle.length > 0) {
          articleNamesTemp[rendement.ID_ARTICLE] = filteredDataArticle[0].article; // Assuming article document has a 'name' field
        }
      }
    }

    setEmployeeNames(prev => ({ ...prev, ...employeeNamesTemp }));
    setArticleNames(prev => ({ ...prev, ...articleNamesTemp }));
  };

  useEffect(() => {
    if (rendementEmploye.length > 0) {
      RendementEmploye();
    }
  }, [rendementEmploye]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="fixed z-40 top-0 overflow-y-auto left-0 w-full h-full bg-black bg-opacity-90">
      <div className="w-4/6 p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
        <div className="bg-gray-800 rounded p-4 text-white text-2xl font-semibold mb-4 rounded-t-lg text-center">
          Rendement Employe
          <button
            className="float-right text-gray-300 hover:text-gray-500"
            onClick={closeModule}
          >
            <IoIosCloseCircle />
          </button>
        </div>
        <div id="printThis" ref={printRef} className="flex justify-center flex-col items-center my-3">
          <div className='flex flex-col gap-3'>
            <div className='flex flex-row justify-center items-center'>
              <p className='text-gray-700 text-center text-xl font-medium p-2'>Project  : </p>
              <h3 className='text-gray-900 text-lg font-medium py-1'>{project ? project : "aucun projet assigné"}</h3>
            </div>
            <div className='flex flex-row justify-center items-center'>
              <p className='text-gray-700 text-center text-xl font-medium p-2'>Corps Etat  : </p>
              <h3 className='text-gray-900 text-lg font-medium py-1'>{corpsEtat ? corpsEtat : "aucun corpsEtat assigné"}</h3>
            </div>
            <div className='flex justify-center items-center'>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700  font-medium  p-2'>Employe : </p>
                {rendementEmploye.map((rendement) => (
                  <h3 key={rendement.ID_EMPLOYE} className='text-gray-900 text-md font-medium p-2 '>
                    {employeeNames[rendement.ID_EMPLOYE] || "aucun employé affecté"}
                  </h3>
                ))}
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium  p-2'>Quantite : </p>
                {rendementEmploye.map((rendement) => (
                  <h3 key={rendement.ID_EMPLOYE + '_quantite'} className='text-gray-900 text-md font-medium p-2'>
                    {rendement ? rendement.Quantite_Article : "0"}
                  </h3>
                ))}
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium  p-2'>Prix Unitaire : </p>
                {rendementEmploye.map((rendement) => (
                  <h3 key={rendement.ID_EMPLOYE + '_prix'} className='text-gray-900 text-md font-medium p-2'>
                    {rendement ? rendement.Prix_Unitaire : "0"}
                  </h3>
                ))}
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium   p-2'>Article :  </p>
                {rendementEmploye.map((rendement) => (
                  <h3 key={rendement.ID_ARTICLE} className='text-gray-900 text-md font-medium p-2'>
                    {articleNames[rendement.ID_ARTICLE] || "aucun Article assigné"}
                  </h3>
                ))}
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium  p-2'>Date :  </p>
                {rendementEmploye.map((rendement) => (
                  <h3 key={rendement.ID_EMPLOYE + '_date'} className='text-gray-900 text-md font-medium p-2'>
                    {rendement ? rendement.Date : new Date().toLocaleDateString()}
                  </h3>
                ))}
              </div>
            </div>
            <div className="text-center my-4">
              <p className="text-md text-gray-600">
                Date d'impression: {new Date().toLocaleDateString()} , {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        <div className="text-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded"
            onClick={handlePrint}
          >
            Imprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Historic;
