import axios from "axios";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../css/admin-panel.css";
import "../css/register.css";
import { HugeiconsIcon } from "@hugeicons/react";
import {
   Loading01Icon,
   Search02Icon,
   UserIcon,
} from "@hugeicons/core-free-icons";
import FaceEnrollOverlay from "../components/FaceEnrollOverlay";
import FaceVerifyOverlay from "../components/FaceVerifyOverlay";

const AdminPanel = () => {
   const { backendUrl, userData, faceVerified } = useContext(AuthContext);
   const [users, setUsers] = useState([]);
   const [activeLoading, setActiveLoading] = useState(null);

   const [selectedAction, setSelectedAction] = useState({});

   const [searchQuery, setSearchQuery] = useState("");
   const [selectedStatus, setSelectedStatus] = useState("all");
   const [selectedRole, setSelectedRole] = useState("all");
   const [sortBy, setSortBy] = useState("id-greatest");

   const [totalUsers, setTotalUsers] = useState();
   const [usersPerPage, setUsersPerPage] = useState(10);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState();

   const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);

      return date.toLocaleString("en-IN", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
         hour12: true,
      });
   };

   const rawParams = {
      search: searchQuery,
      status: selectedStatus,
      role: selectedRole,
      sort: sortBy,
      page: currentPage,
      limit: usersPerPage,
   };

   const cleanedParams = Object.fromEntries(
      Object.entries(rawParams).filter(([key, value]) => {
         if (
            value === "" ||
            value === null ||
            value === undefined ||
            value === "all"
         )
            return false;

         if (key === "page" && value <= 1) return false;

         if (key === "sort" && value === "id-greatest") return false;

         return true;
      }),
   );

   const fetchUsers = async () => {
      try {
         const { data: responseData } = await axios.get(
            `${backendUrl}/api/admin/get-all-users`,
            { params: cleanedParams, withCredentials: true },
         );

         if (responseData.success) {
            setUsers(responseData.users)
            setTotalUsers(responseData.pagination.totalUsers);
            setCurrentPage(responseData.pagination.currentPage);
            setUsersPerPage(responseData.pagination.usersPerPage);
            setTotalPages(responseData.pagination.totalPages);

            const statuses = {};

            responseData.users.forEach((user) => {
               statuses[user.id] = user.status;
            });

            setSelectedAction(statuses);
         }
      } catch (err) {
         console.log(err.response?.data?.message || err.message);
      }
   };

   const handleAction = async (userId, action) => {
      setActiveLoading({ userId, action: "status-update" });

      try {
         let response;
         if (action === "approved") {
            response = await axios.patch(
               `${backendUrl}/api/admin/approve/${userId}`,
               { withCredentials: true },
            );
         }
         if (action === "rejected") {
            response = await axios.patch(
               `${backendUrl}/api/admin/reject/${userId}`,
               { withCredentials: true },
            );
         }
         if (action === "pending") {
            response = await axios.patch(
               `${backendUrl}/api/admin/pending/${userId}`,
               { withCredentials: true },
            );
         }

         if (response.data.success) {
            alert(response.data.message);
            await fetchUsers();
         }
      } catch (err) {
         alert(err.response?.data?.message || err.message);
      } finally {
         setActiveLoading(null);
      }
   };

   useEffect(() => {
      const rawParams = {
         search: searchQuery,
         status: selectedStatus,
         role: selectedRole,
         sort: sortBy,
         page: currentPage,
         limit: usersPerPage,
      };

      const cleanedParams = Object.fromEntries(
         Object.entries(rawParams).filter(([key, value]) => {
            if (
               value === "" ||
               value === null ||
               value === undefined ||
               value === "all"
            )
               return false;

            if (key === "page" && value <= 1) return false;

            if (key === "sort" && value === "id-greatest") return false;

            return true;
         }),
      );

      const handleTableOptions = async () => {
         try {
            const { data: responseData } = await axios.get(
               `${backendUrl}/api/admin/get-all-users`,
               { params: cleanedParams, withCredentials: true },
            );

            if (responseData.success) {
               setUsers(responseData.users);
               setTotalUsers(responseData.pagination.totalUsers);
               setCurrentPage(responseData.pagination.currentPage);
               setUsersPerPage(responseData.pagination.usersPerPage);
               setTotalPages(responseData.pagination.totalPages);

               const statuses = {};

               responseData.users.forEach((user) => {
                  statuses[user.id] = user.status;
               });

               setSelectedAction(statuses);
            }
         } catch (err) {
            alert(err.response?.data?.message || err.message);
         }
      };

      handleTableOptions();
   }, [
      backendUrl,
      searchQuery,
      selectedRole,
      selectedStatus,
      sortBy,
      currentPage,
      usersPerPage,
   ]);

   if (currentPage > totalPages) {
      setCurrentPage(totalPages);
   }

   if (userData?.role === 'admin' && !userData?.faceEnrolled) {
      return <FaceEnrollOverlay />
   }

   if (userData?.role === 'admin' && userData?.faceEnrolled && !faceVerified) {
      return <FaceVerifyOverlay />
   }

   return (
      <>
         <Navbar />
         <div className="admin-main">
            <div className="admin-heading">Admin Panel</div>

            <div className="admin-content">
               <div className="table-options">
                  <div className="search-and-filters">
                     <div className="search-group">
                        <HugeiconsIcon
                           icon={Search02Icon}
                           strokeWidth={2}
                           size={17}
                           className="search-icon"
                        />
                        <input
                           type="text"
                           name="userSearch"
                           placeholder="Search by User name, email, phone etc."
                           value={searchQuery}
                           onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                           }}
                        />
                     </div>
                     <div className="filter-group">
                        <select
                           name="statusFilter"
                           value={selectedStatus}
                           onChange={(e) => {
                              setSelectedStatus(e.target.value);
                              setCurrentPage(1);
                           }}
                        >
                           <option value="all">All Statuses</option>
                           <option value="pending">Pending</option>
                           <option value="approved">Approved</option>
                           <option value="rejected">Rejected</option>
                        </select>
                        <select
                           name="roleFilter"
                           value={selectedRole}
                           onChange={(e) => {
                              setSelectedRole(e.target.value);
                              setCurrentPage(1);
                           }}
                        >
                           <option value="all">All Roles</option>
                           <option value="user">User</option>
                           <option value="admin">Admin</option>
                        </select>
                        <select
                           name="sortFilter"
                           value={sortBy}
                           onChange={(e) => setSortBy(e.target.value)}
                        >
                           <option value="id-greatest">
                              UserID Greatest First
                           </option>
                           <option value="id-least">UserID Least First</option>
                           <option value="created-newest">
                              Created Newest First
                           </option>
                           <option value="created-oldest">
                              Created Oldest First
                           </option>
                           <option value="updated-newest">
                              Updated Newest First
                           </option>
                           <option value="updated-oldest">
                              Updated Oldest First
                           </option>
                           <option value="az">Name A-Z</option>
                           <option value="za">Name Z-A</option>
                        </select>
                     </div>
                  </div>

                  <div className="user-per-page">
                     <span>
                        <HugeiconsIcon
                           icon={UserIcon}
                           size={17}
                           strokeWidth={2}
                        />{" "}
                        Users Per Page:
                     </span>
                     <select
                        name="userPerPage"
                        value={usersPerPage}
                        onChange={(e) => {
                           setUsersPerPage(Number(e.target.value));
                           setCurrentPage(1);
                        }}
                     >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="150">150</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                     </select>
                  </div>
               </div>

               <span className="pagination-metadata">
                  Showing{" "}
                  {totalUsers === 0
                     ? ""
                     : `${(currentPage - 1) * usersPerPage + 1}-${Math.min(currentPage * usersPerPage, totalUsers)} of`}{" "}
                  {totalUsers} users
               </span>

               <div className="users-table">
                  <table>
                     <thead>
                        <tr>
                           <th>User ID</th>
                           <th>Email Address</th>
                           <th>Name</th>
                           <th>Phone Number</th>
                           <th>Role</th>
                           <th>Status</th>
                           {/* <th>Rejection Reason</th> */}
                           <th>Created At</th>
                           <th>Updated At</th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {users.length > 0 ? (
                           users.map((user) => (
                              <tr key={user.id}>
                                 <td>{user.id ? user.id : "---"}</td>
                                 <td>{user.email ? user.email : "---"}</td>
                                 <td>{user.name ? user.name : "---"}</td>
                                 <td>+91 {user.phone ? user.phone : "---"}</td>
                                 <td style={{ textTransform: "capitalize" }}>
                                    {user.role ? user.role : "---"}
                                 </td>
                                 <td>
                                    <span className={`${user.status}-tag`}>
                                       {user.status ? user.status : "---"}
                                    </span>
                                 </td>
                                 {/* <td>
                                 {user.status === "rejected"
                                    ? user.rejection_reason
                                    ? user.rejection_reason
                                    : "---"
                                    : "N/A"}
                              </td> */}
                                 <td>
                                    {user.created_at
                                       ? formatTimestamp(user.created_at)
                                       : "---"}
                                 </td>
                                 <td>
                                    {user.updated_at
                                       ? formatTimestamp(user.updated_at)
                                       : "---"}
                                 </td>
                                 <td className="action-cell">
                                    <select
                                       value={
                                          selectedAction[user.id] || user.status
                                       }
                                       onChange={(e) =>
                                          setSelectedAction((prev) => ({
                                             ...prev,
                                             [user.id]: e.target.value,
                                          }))
                                       }
                                       disabled={
                                          activeLoading?.userId === user.id
                                       }
                                    >
                                       <option value="pending">Pending</option>
                                       <option value="approved">
                                          Approved
                                       </option>
                                       <option value="rejected">
                                          Rejected
                                       </option>
                                    </select>
                                    <button
                                       className="action-btn"
                                       onClick={() =>
                                          handleAction(
                                             user.id,
                                             selectedAction[user.id],
                                          )
                                       }
                                       disabled={
                                          selectedAction[user.id] ===
                                             user.status ||
                                          activeLoading?.userId === user.id
                                       }
                                    >
                                       {activeLoading?.userId === user.id ? (
                                          <HugeiconsIcon
                                             icon={Loading01Icon}
                                             size={16}
                                             className="spin-animation"
                                             strokeWidth={2.5}
                                          />
                                       ) : (
                                          "Submit"
                                       )}
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan={9} className="no-records">
                                 😓 No records found
                              </td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               <div className="pagination-controls">
                  <button
                     disabled={currentPage === 1}
                     onClick={() => setCurrentPage(currentPage - 1)}
                  >
                     Previous
                  </button>
                  <span>
                     Page {currentPage} of {totalPages}
                  </span>
                  <button
                     disabled={currentPage === totalPages}
                     onClick={() => setCurrentPage(currentPage + 1)}
                  >
                     Next
                  </button>
               </div>
            </div>
         </div>
      </>
   );
};

export default AdminPanel;
