// "use client";

// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import { ContractAbi } from "../../contractUtils/Blockchain";

// const CONTRACT_ADDRESS = "0x3482740C57292B4b5FDae9D8F0dbfF633951ed9F";

// export function LandRegistry() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedRecord, setSelectedRecord] = useState<any>(null);
//   const [landRecords, setLandRecords] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLands = async () => {
//       try {
//         if (!window.ethereum) return console.error("MetaMask not detected");

//         const provider = new ethers.BrowserProvider(window.ethereum);
//         await provider.send("eth_requestAccounts", []);
//         const contract = new ethers.Contract(CONTRACT_ADDRESS, ContractAbi, provider);

//         // ✅ Use a getter function instead of private variable
//         const totalLandId = await contract.getTotalLands(); // Add this function in your Solidity contract

//         const landPromises = [];
//         for (let i = 1; i <= totalLandId; i++) {
//           landPromises.push(
//             contract.getLand(i).then((data: any) => ({
//               id: `LAND${String(i).padStart(3, "0")}`,
//               property: `Property ${i}`, // Off-chain metadata can be fetched using landHash
//               owner: data[0],
//               area: "Unknown",
//               type: "Unknown",
//               registrationDate: "Unknown",
//               lastUpdated: "Unknown",
//               coordinates: "Unknown",
//               status: data[1] ? "active" : "under_review",
//               taxStatus: "paid", // Add logic if needed
//               landHash: data[2],
//             }))
//           );
//         }

//         const lands = await Promise.all(landPromises);
//         setLandRecords(lands);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching lands:", err);
//         setLoading(false);
//       }
//     };

//     fetchLands();
//   }, []);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "active":
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span>;
//       case "under_review":
//         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Under Review</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
//     }
//   };

//   const getTaxStatusBadge = (status: string) => {
//     switch (status) {
//       case "paid":
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{status}</span>;
//     }
//   };


  
//   const openModal = (record: any) => {
//     setSelectedRecord(record);
//   };
//   if (loading) return <div>Loading lands from blockchain...</div>;

//   return (
//     <div className="space-y-6">
//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search by property or owner"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded px-3 py-2 w-full"
//         />
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full">
//           <thead className="bg-gray-50">
//             <tr>
//               <th>Record ID</th>
//               <th>Property</th>
//               <th>Owner</th>
//               <th>Type</th>
//               <th>Area</th>
//               <th>Status</th>
//               <th>Tax Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {landRecords
//               .filter(
//                 (record) =>
//                   record.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                   record.owner.toLowerCase().includes(searchTerm.toLowerCase())
//               )
//               .map((record) => (
//                 <tr key={record.id} className="hover:bg-gray-50">
//                   <td>{record.id}</td>
//                   <td>{record.property}</td>
//                   <td>{record.owner}</td>
//                   <td>{record.type}</td>
//                   <td>{record.area}</td>
//                   <td>{getStatusBadge(record.status)}</td>
//                   <td>{getTaxStatusBadge(record.taxStatus)}</td>
//                   <td>
//                     <button onClick={() => openModal(record)}>Edit</button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
