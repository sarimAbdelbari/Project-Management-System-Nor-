import React, { useState } from 'react';
import {
  sucess_toast,
  error_toast,
} from "../../../util/toastNotification";
import LoadingPage from "../../../util/LoadingPage";
import { db} from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";

const NewProject = () => {
  
  const [designationProjet, setDesignationProjet] = useState("");
  const [localisation , setLocalisation] = useState("");
  const [date_debut , setDate_debut] = useState("");
  const [duree_mois , setDuree_mois] = useState("");
  const [date_fin_prevue , setDate_fin_prevue] = useState("");
  const [date_fin_reelle , setDate_fin_reelle] = useState("");
  const [cout_prevu , setCout_prevu] = useState("");
  const [cout_realise , setCout_realise] = useState("");

  const [isLoading , setIsLoading] = useState("");

  const projetCollectionRef =  collection(db, "projet");


  const SubmitProject = async () => {
    try {
      setIsLoading(true); 


      await addDoc(projetCollectionRef, {
        id: v4(),
        DESIGNATION_PROJET:designationProjet,
        LOCALISATION: localisation,
        cree_le: new Date(),
        Cree_Par: "Admin",
        duree_mois: duree_mois,
        date_debut: date_debut,
        date_fin_prevue: date_fin_prevue,
        date_fin_reelle: date_fin_reelle,
        cout_prevu: cout_prevu,
        cout_realise: cout_realise,
      });

      setLocalisation("");
      setDesignationProjet("");
      setDuree_mois("");
      setDate_debut("");
      setDate_fin_prevue("");
      setCout_prevu("");
      setDate_fin_reelle("");
      setCout_realise("");
      sucess_toast("Le projet a été ajouté avec succès"); 

      setIsLoading(false); 

    } catch (err) {
      console.error(err);
      error_toast("Erreur lors de l'ajout d'un projet");
    }
  }

  return (
    <div>
      {isLoading && <LoadingPage /> }
      <div className=" overflow-y-auto  w-full h-full   bg-opacity-90">
      <div className=" p-8 my-8  rounded-lg shadow-lg bg-white mx-auto">
        <div className=" bg-gray-200  rounded p-4 text-2xl font-semibold mb-4 rounded-t-lg text-center">
            Cree un Projet 
        </div>
        <div className="flex flex-wrap gap-6 justify-around ">
        <div className="mx-7 flex flex-col justify-center items-center">
                  <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
                   Designation Projet :
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setDesignationProjet(e.target.value)}
                    value={designationProjet}
                  />
                </div>
        <div className="mx-7 flex flex-col justify-center items-center">
                  <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium">
                    Localisation :
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setLocalisation(e.target.value)}
                    value={localisation}
                  />
                </div>
        <div className="mx-7 flex flex-col justify-center items-center">
                  <label htmlFor="file" className="flex items-center gap-2 mb-5 text-lg font-medium ">
                    duree_mois :
                  </label>
                  <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setDuree_mois(e.target.value)}
                    value={duree_mois}
                  />
        </div>
        <div className="mx-7 flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium ">
                Date debut:
              </label>
              <input
                type="date"
                className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                onChange={(e) => setDate_debut(e.target.value)}
                value={date_debut}
              />
        </div>

              <div className="mx-7 flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium ">
              Date fin Prevue:
              </label>
              <input
                type="date"
                className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"

                onChange={(e) => setDate_fin_prevue(e.target.value)}
                value={date_fin_prevue}
              />
            </div>
              <div className="mx-7 flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium ">
              Date_fin_reelle:
              </label>
              <input
                type="date"
                className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                onChange={(e) => setDate_fin_reelle(e.target.value)}
                value={date_fin_reelle}
              />
            </div>
              <div className="mx-7 flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium ">
                cout_prevu:
              </label>
              <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setCout_prevu(e.target.value)}
                    value={cout_prevu}
                  />
            </div>
              <div className="mx-7 flex flex-col justify-center items-center">
              <label className="flex items-center gap-2 mb-5 text-lg font-medium ">
                cout_realise:
              </label>
              <input
                    type="text"
                    id="text"
                    className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
                    onChange={(e)=> setCout_realise(e.target.value)}
                    value={cout_realise}
                  />
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

export default NewProject;