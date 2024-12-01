import React, { useState } from 'react';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../firebase.js';
import LoadingPage from "../../util/LoadingPage.jsx";
import { sucess_toast, error_toast } from '../../util/toastNotification.js';

export default function AddCsvEmployee() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to handle CSV file upload and parsing
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const rows = text.split('\n').map(row => row.split(';'));

        if (rows.length < 2) {
          throw new Error('CSV file is empty or does not contain data.');
        }

        const headers = rows[0].map(header => header.trim().toUpperCase()); // Extract headers and trim whitespace

        const parsedData = rows.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            const value = row[index] ? row[index].trim() : ''; // Check for undefined values and trim whitespace
            if (value !== '') {
              obj[header] = value;
            }
          });
          obj.DATE_EFFET = new Date(); // Add DATE_EFFET field
          return obj;
        });

        // Create a set of all id_responsable values
        const responsableIds = new Set(parsedData.map(data => data.ID_RESPONSABLE));


        console.log(responsableIds) ;

        // Assign roles based on id_responsable set
        const updatedData = parsedData.map(data => {
          if (responsableIds.has(data.ID_EMPLOYE)) {
            data.role = 'responsable';
          } else {
            data.role = 'employe';
          }
          return data;
        });

        console.log("Updated Data", updatedData);

        setData(updatedData);

      } catch (error) {
        console.error('Error parsing CSV file:', error);
        error_toast("Error parsing CSV file. Please check the file format.");
      }
    };

    reader.readAsText(file);
  };

  // Function to import parsed data into Firestore using batch
  const importDataToFirestore = async () => {
    setLoading(true);

    const collectionRef = collection(db, 'employe');

    try {
      // Filter out duplicates based on EMPLOYE_id
      const uniqueData = removeDuplicates(data, 'ID_EMPLOYE');
      const batch = writeBatch(db);

      uniqueData.forEach((item) => {
        if (Object.keys(item).length > 0 && item.ID_EMPLOYE) { // Check for non-empty ID_EMPLOYE
          const docRef = doc(collectionRef, item.ID_EMPLOYE);
          batch.set(docRef, item);
        }
      });

      await batch.commit();
      
      sucess_toast("Data successfully imported into Firestore.");
      setData([]);
    } catch (error) {
      console.error('Error writing document to Firestore:', error);
      error_toast("Error writing document to Firestore. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  // Function to remove duplicates based on a specific key
  const removeDuplicates = (arr, key) => {
    const uniqueKeys = new Set();
    const uniqueArray = [];
    arr.forEach(item => {
      if (item[key] && !uniqueKeys.has(item[key])) {
        uniqueKeys.add(item[key]);
        uniqueArray.push(item);
      }
    });
    return uniqueArray;
  };

  return (
    <div>
      {loading && <LoadingPage />}
      <div className='flex flex-col justify-center items-center gap-4'>
        <h1 className='text-3xl'>CSV Importer For Firebase</h1>
        <input type="file" accept=".csv" className='p-4' onChange={handleFileUpload} />
        <button
          onClick={importDataToFirestore}
          className='bg-[#243b8c] text-white w-40 p-4 rounded-3xl'
          disabled={loading}
        >
          Import Data to Firestore
        </button>
      </div>
    </div>
  );
}











// *****************************************************************
// import React, { useState } from 'react';
// import { collection, setDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebase.js';
// import LoadingPage from "../../util/LoadingPage.jsx";
// import { sucess_toast, error_toast } from '../../util/toastNotification.js';

// export default function AddCsvEmployee() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Function to handle CSV file upload and parsing
//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       try {
//         const text = event.target.result;
//         const rows = text.split('\n').map(row => row.split(';'));

//         if (rows.length < 2) {
//           throw new Error('CSV file is empty or does not contain data.');
//         }

//         const headers = rows[0].map(header => header.trim()); // Extract headers and trim whitespace
//         const parsedData = rows.slice(1).map(row => {
//           const obj = {};
//           headers.forEach((header, index) => {
//             const value = row[index] ? row[index].trim() : ''; // Check for undefined values and trim whitespace
//             if (value !== '') {
//               obj[header] = value;
//             }
//           });
//           obj.DATE_EFFET = new Date(); // Add DATE_EFFET field
//           return obj;
//         });

//         setData(parsedData);

//       } catch (error) {
//         console.error('Error parsing CSV file:', error);
//         error_toast("Error parsing CSV file. Please check the file format.");
//       }
//     };

//     reader.readAsText(file);
//   };

//   // Function to import parsed data into Firestore
//   const importDataToFirestore = async () => {
//     setLoading(true);

//     const collectionRef = collection(db, 'TestAgain');

//     try {
//       // Filter out duplicates based on id_employe
//       const uniqueData = removeDuplicates(data, 'EMPLOYE_id');
      
//       for (const item of uniqueData) {
//         if (Object.keys(item).length > 0 && item.EMPLOYE_id) { // Check for non-empty EMPLOYE_id
//           await setDoc(doc(collectionRef, item.EMPLOYE_id), item);
//         }
//       }

//       sucess_toast("Data successfully imported into Firestore.");
//       setData([]);
//     } catch (error) {
//       console.error('Error writing document to Firestore:', error);
//       error_toast("Error writing document to Firestore. Check the console for details.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to remove duplicates based on a specific key
//   const removeDuplicates = (arr, key) => {
//     const uniqueKeys = new Set();
//     const uniqueArray = [];
//     arr.forEach(item => {
//       if (item[key] && !uniqueKeys.has(item[key])) {
//         uniqueKeys.add(item[key]);
//         uniqueArray.push(item);
//       }
//     });
//     return uniqueArray;
//   };

//   return (
//     <div>
//       {loading && <LoadingPage />}
//       <div className='flex flex-col justify-center items-center gap-4'>
//         <h1 className='text-3xl'>CSV Importer For Firebase</h1>
//         <input type="file" accept=".csv" className='p-4' onChange={handleFileUpload} />
//         <button
//           onClick={importDataToFirestore}
//           className='bg-[#243b8c] text-white w-40 p-4 rounded-3xl'
//           disabled={loading}
//         >
//           Import Data to Firestore
//         </button>
//       </div>
//     </div>
//   );
// }

// *****************************************************************
// import React, { useState } from 'react';
// import { collection, setDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebase';
// import { sucess_toast, error_toast } from '../../util/toastNotification';
// import { getAuth, createUserWithEmailAndPassword ,signOut } from 'firebase/auth';

// const CsvHandler = () => {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);

//   const auth = getAuth();

//   const handleFileUpload = async (file) => {
//     const reader = new FileReader();

//     reader.onload = async (event) => {
//       try {
//         const text = event.target.result;
//         const rows = text.split('\n').map(row => row.split(';'));

//         if (rows.length < 2) {
//           throw new Error('CSV file is empty or does not contain data.');
//         }

//         const headers = rows[0].map(header => header.trim()); // Extract headers and trim whitespace
//         const parsedData = rows.slice(1).map(row => {
//           const obj = {};
//           headers.forEach((header, index) => {
//             const value = row[index] ? row[index].trim() : ''; // Check for undefined values and trim whitespace
//             if (value !== '') {
//               obj[header] = value;
//             }
//           });
//           obj.DATE_EFFET = new Date(); // Add DATE_EFFET field
//           return obj;
//         });

//         setData(parsedData);
//         sucess_toast('CSV file parsed successfully.');
//       } catch (error) {
//         console.error('Error parsing CSV file:', error);
//         error_toast('Error parsing CSV file. Please check the file format.');
//       }
//     };

//     reader.readAsText(file);
//   };

//   const importDataToFirestore = async () => {
//     setLoading(true);

//     try {
//       // Example: handling import to Firestore
//       for (const item of data) {
//         if (item.role == 'responsable') {
//           // If employee role is 'responsable', authenticate them
//           await authenticateAndAddResponsable(item);
//         } else {
//           // If employee role is 'employe', directly add to Firestore
//           await addEmployeeToFirestore(item);
//         }
//       }

//       sucess_toast('Data successfully imported into Firestore.');
//       setData([]); // Clear data after import
//     } catch (error) {
//       console.error('Error writing document to Firestore:', error);
//       error_toast('Error writing document to Firestore. Check the console for details.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const authenticateAndAddResponsable = async (item) => {
//     try {
//       const { email, password,EMPLOYE_id,FONCTION, NOM_EMPLOYE ,PRENOM_EMPLOYE,...employeeData } = item;

//       // Create Firebase Auth user with email and password
//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;

//       const collectionRefEmp = collection(db, 'TestEmploye');
//       await setDoc(doc(collectionRefEmp, item.id), {
//         EMPLOYE_id:EMPLOYE_id,
//         id:item.id,
//         email: email,
//         uid: user.uid,
//         FONCTION:FONCTION,
//         NOM_EMPLOYE:NOM_EMPLOYE,
//         PRENOM_EMPLOYE:PRENOM_EMPLOYE,
//         DATE_EFFET: new Date(),
//       }); 
      
//       // Add additional data to Firestore
//       const collectionRefRes = collection(db, 'responsableProject');
//       await setDoc(doc(collectionRefRes, user.uid), {
//         id:item.id,
//         EMPLOYE_id:EMPLOYE_id,
//         email: email,
//         uid: user.uid,
//         DATE_EFFET: new Date(),
//       });

//       // Sign out the newly created user
//       await signOut(auth);

//       sucess_toast('Responsable successfully added and authenticated.');
//     } catch (error) {
//       console.error('Error creating or adding responsable:', error);
//       error_toast('Error creating or adding responsable.');
//     }
//   };

//   const addEmployeeToFirestore = async (item) => {
//     try {

//       const collectionRef = collection(db, 'TestEmploye');
//       await setDoc(doc(collectionRef, item.id), item); // Adjust as per your Firestore schema

//       sucess_toast('Employee successfully added to Firestore.');
      
//     } catch (error) {
//       console.error('Error adding employee to Firestore:', error);
//       error_toast('Error adding employee to Firestore.');
//     }
//   };

//   return (
//     <div>
//       <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e.target.files[0])} />
//       <button onClick={importDataToFirestore} disabled={loading}>
//         Import Data to Firestore
//       </button>
//       {loading && <p>Loading...</p>}
//     </div>
//   );
// };

// export default CsvHandler;

