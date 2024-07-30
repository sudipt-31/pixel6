import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBRow,
  MDBCol,
  MDBContainer,
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = async () => {
    try {
      const response = await axios.get("https://dummyjson.com/users");
      // Verify and use the response data correctly
      if (Array.isArray(response.data)) {
        setData(response.data); // Directly set if response.data is an array
      } else if (response.data && Array.isArray(response.data.users)) {
        setData(response.data.users); // Use response.data.users if it's an array
      } else {
        console.error("Unexpected response structure", response.data);
        setData([]); // Set an empty array on unexpected structure
      }
    } catch (err) {
      console.error("Error fetching data", err);
      setData([]); // Set an empty array on error
    }
  };

  return (
    <MDBContainer>
      <div style={{ marginTop: "100px" }}>
        <h2>Employees</h2>
        <MDBRow>
          <MDBCol size="10">
            <MDBTable>
              <MDBTableHead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Image</th>
                  <th scope="col">Full Name</th>
                  <th scope="col">Demography</th>
                  <th scope="col">Designation</th>
                  <th scope="col">Location</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id}>
                      <th scope="row">{item.id}</th>
                      <td>
                        <img
                          src={item.image}
                          alt={`${item.firstName} ${item.lastName}`}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </td>
                      <td>
                        {item.firstName}{" "}
                        {item.maidenName ? item.maidenName + " " : ""}
                        {item.lastName}
                      </td>
                      <td>
                        {item.gender === "male" ? "M/" : "F/"}
                        {item.age}
                      </td>
                      <td>{item.company.title}</td>
                      <td>{item.address.state}</td>
                    </tr>
                  ))
                )}
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
}

export default App;
