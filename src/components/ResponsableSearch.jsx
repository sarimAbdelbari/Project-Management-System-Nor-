import React, { useState, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../firebase";
import debounce from 'lodash.debounce';
import { error_toast, info_toast } from '../util/toastNotification';

const ResponsableSearch = ({ onSelectEmployee ,isMulti  }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const fetchEmployees = async (term) => {
    if (!term) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    const employeCollectionRef = collection(db, "employe");
    const employeeQuery = query(
      employeCollectionRef,
      where("NOM", ">=", term.toUpperCase()),
      where("NOM", "<=", term.toUpperCase() + '\uf8ff')
    );

    try {
      const querySnapshot = await getDocs(employeeQuery);
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).filter(emp => emp.role === "responsable");
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchEmployees = useCallback(
    debounce((term) => fetchEmployees(term), 500),
    []
  );

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedFetchEmployees(term);
  };

  const handleSelectEmployee = (employee) => {
    if (isMulti) {
      setSelectedEmployees((prev) => {
        const newSelected = [...prev, employee];
        onSelectEmployee(newSelected);
        return newSelected;
      });
    } else {
      setSelectedEmployees([employee]);
      onSelectEmployee(employee);
      setSearchTerm(`${employee.NOM} ${employee.PRENOM}`);
    }
    setSearchResults([]);
  };

  const handleRemoveEmployee = (employee) => {
    const updatedSelected = selectedEmployees.filter(emp => emp.id !== employee.id);
    setSelectedEmployees(updatedSelected);
    onSelectEmployee(updatedSelected);
    if (!isMulti) {
      setSearchTerm('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Responsable"
        value={searchTerm}
        onChange={handleSearchChange}
        className="min-w-64 p-2 border border-gray-400 rounded-md focus:outline-none focus:border-[#54ad34]"
      />
      {loading && <p>Loading...</p>}
      {searchResults.length > 0 && (
        <ul className="border border-gray-300 mt-2 max-h-48 overflow-y-auto">
          {searchResults.map(employee => (
            <li
              key={employee.id}
              onClick={() => handleSelectEmployee(employee)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {employee.NOM} {employee.PRENOM}
            </li>
          ))}
        </ul>
      )}
      {selectedEmployees.length > 0 && isMulti && (
        <div className="mt-2">
          {selectedEmployees.map(employee => (
            <div key={employee.id} className="flex justify-between items-center bg-gray-100 p-2 rounded-md mt-1">
              <span>{employee.NOM} {employee.PRENOM}</span>
              <button onClick={() => handleRemoveEmployee(employee)} className="text-red-500 hover:text-red-700">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResponsableSearch;
