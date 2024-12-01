import React, { useRef } from 'react';
import { IoIosCloseCircle } from "react-icons/io";
import { useReactToPrint } from 'react-to-print';
import { useStateContext } from '../../contexts/ContextProvider';

const Facture = (props) => {
  const {date, newEmploye, quantite_Article, prixUnitaire, newArticle, project, corpsEtat } = props;
  const { setShowFacture } = useStateContext();

  const closeModule = () => {
    setShowFacture(false);
  };

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="fixed z-40 top-0 overflow-y-auto left-0 w-full h-full bg-black bg-opacity-90">
      <div className="w-4/6 p-8 my-8 rounded-lg shadow-lg bg-white mx-auto">
        <div className="bg-gray-800 rounded p-4 text-white text-2xl font-semibold mb-4 rounded-t-lg text-center">
          Responsable Projet
          <button
            className="float-right text-gray-300 hover:text-gray-500"
            onClick={closeModule}
          >
            <IoIosCloseCircle />
          </button>
        </div>
        <div id="printThis" ref={printRef} className="flex justify-center flex-col items-center">
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
                <h3 className='text-gray-900 text-md font-medium p-2 '>{newEmploye ? newEmploye : "aucun employé affecté"}</h3>
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium  p-2'>Quantite : </p>
                <h3 className='text-gray-900 text-md font-medium p-2'>{quantite_Article ? quantite_Article : "0"}</h3>
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium  p-2'>Prix Unitaire : </p>
                <h3 className='text-gray-900 text-md font-medium p-2'>{prixUnitaire ? prixUnitaire : "0"}</h3>
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium   p-2'>Article :  </p>
                <h3 className='text-gray-900 text-md font-medium p-2'>{newArticle ? newArticle : "aucun Article assigné"}</h3>
              </div>
              <div className='flex flex-col gap-1 border-2 border-gray-700'>
                <p className='text-gray-700 text-lg border-b-2 border-gray-700 font-medium  p-2'>Date :  </p>
                <h3 className='text-gray-900 text-md font-medium p-2'>{date}</h3>
              </div>
            </div>
          </div>
          <div className="text-center my-4">
            <p className="text-md text-gray-600">
              Date d'impression: {new Date().toLocaleDateString()} , {new Date().toLocaleTimeString()}
            </p>
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

export default Facture;
