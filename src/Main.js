import React from "react";
import { useEffect, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";

const Main = () => {
  const [userData, setUserdata] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const [editableMember, setEditableMember] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const getData = async () => {
      const reqData = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      const resData = await reqData.json();
      setUserdata(resData);
    };
    getData();
  }, []);

  const filteredUsers = userData.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(userData.length / pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowSelect = (userId) => {
    const isSelected = selectedRows.includes(userId);
    setSelectedRows(
      isSelected
        ? selectedRows.filter((id) => id !== userId)
        : [...selectedRows, userId]
    );
  };

  const handleEdit = (id) => {
    const memberToEdit = userData.find((member) => member.id === id);
    setEditableMember(memberToEdit);
  };

  // Handle row saving
  const handleSave = () => {
    setUserdata((prevMembers) =>
      prevMembers.map((member) =>
        member.id === editableMember.id
          ? { ...member, ...editableMember }
          : member
      )
    );
    setEditableMember(null); // Exit editing mode
  };

  const handleDelete = (userId) => {
    setUserdata(userData.filter((user) => user.id !== userId));
  };

  const handleSelectAll = () => {
    const allPageUserIds = paginatedUsers.map((user) => user.id);
    setSelectedRows(
      selectedRows.length === allPageUserIds.length
        ? selectedRows.filter((id) => !allPageUserIds.includes(id))
        : [...selectedRows, ...allPageUserIds]
    );
  };

  // Handle delete selected rows
  const handleDeleteSelected = () => {
    setUserdata(userData.filter((user) => !selectedRows.includes(user.id)));

    setSelectedRows([]);
  };

  return (
    <>
      <div className="top">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="t-btn" onClick={handleDeleteSelected}>
          <MdDelete />
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === paginatedUsers.length}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((getusers) => (
            <tr
              key={getusers.id}
              style={
                selectedRows.includes(getusers.id) ? { background: "#eee" } : {}
              }
            >
              <th>
                {" "}
                <input
                  type="checkbox"
                  checked={selectedRows.includes(getusers.id)}
                  onChange={() => handleRowSelect(getusers.id)}
                />
              </th>

              <td>
                {editableMember?.id === getusers.id ? (
                  <input
                    type="text"
                    value={editableMember.name}
                    onChange={(e) =>
                      setEditableMember({
                        ...editableMember,
                        name: e.target.value,
                      })
                    }
                  />
                ) : (
                  getusers.name
                )}
              </td>
              <td>
                {editableMember?.id === getusers.id ? (
                  <input
                    type="text"
                    value={editableMember.email}
                    onChange={(e) =>
                      setEditableMember({
                        ...editableMember,
                        email: e.target.value,
                      })
                    }
                  />
                ) : (
                  getusers.email
                )}
              </td>
              <td>
                {editableMember?.id === getusers.id ? (
                  <input
                    type="text"
                    value={editableMember.role}
                    onChange={(e) =>
                      setEditableMember({
                        ...editableMember,
                        role: e.target.value,
                      })
                    }
                  />
                ) : (
                  getusers.role
                )}
              </td>

              <td>
                {editableMember && editableMember.id === getusers.id ? (
                  <button onClick={() => handleSave()}>Save</button>
                ) : (
                  <>
                    <button
                      className="btn"
                      onClick={() => handleEdit(getusers.id)}
                    >
                      <BiEdit />
                    </button>
                    <button
                      className="btn"
                      onClick={() => handleDelete(getusers.id)}
                    >
                      <MdDelete />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last
        </button>
      </div>
    </>
  );
};

export default Main;
