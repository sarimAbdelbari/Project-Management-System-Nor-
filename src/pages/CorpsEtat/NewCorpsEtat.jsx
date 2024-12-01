import React, { useState } from 'react';
import {
  sucess_toast,
  error_toast,
} from "../../util/toastNotification";

import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";
import LoadingPage from "../../util/LoadingPage";


const NewCorpsEtat = () => {
    const [corps_etat , setCorps_etat] = useState("");
    const [isLoading , setIsLoading] = useState("");


    const CorpsEtatCollectionRef =  collection(db, "corps_etat");

  const SubmitProject = async () => {
    try {
      setIsLoading(true); 
      await addDoc(CorpsEtatCollectionRef, {
        id: v4(),
        lib_corps: corps_etat,
        cree_le: new Date(),
        Cree_Par: "Admin",
      });

      
      setCorps_etat("");
      sucess_toast("Le CorpsEtat a été ajouté avec succès"); 

      setIsLoading(false); 

    } catch (err) {
      console.error(err);
      error_toast("Erreur lors de l'ajout d'un CorpsEtat");
    }
  }

  return (
    <div>
      {isLoading && <LoadingPage /> }
      <div className=" overflow-y-auto  w-full h-full   bg-opacity-90">
      <div className="w-2/3 p-8 my-8  rounded-lg shadow-lg bg-white mx-auto">
        <div className=" bg-gray-200  rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
            Cree un Corps Etat 
        </div>
        <div className="flex flex-wrap gap-6 justify-around flex-col ">
        <div className=" flex flex-col justify-center items-center">
                  <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
                    Nom Corps Etat :
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setCorps_etat(e.target.value)}
                    value={corps_etat}
                  />
                </div>
                <div className=" flex flex-col justify-center items-center">
                  <div className="text-center">
            <p className="text-md text-gray-700 min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]">
              Date:  <br/>
              {new Date().toLocaleDateString()} , {new Date().toLocaleTimeString() }
            </p> 
          </div>
        </div>
        </div>
        <div className='flex justify-center items-center'>
        <button
                  onClick={SubmitProject}
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

export default NewCorpsEtat