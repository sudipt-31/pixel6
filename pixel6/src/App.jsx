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
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBPagination,MDBPaginationItem,MDBPaginationLink, MDBBtn
} from "mdb-react-ui-kit";

function App() {
  const [data, setData] = useState([]);
  const [openNavBasic, setOpenNavBasic] = useState(false);
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [currentPage, setcurrentPage] = useState(0);
  const [pageLimit]=useState(10);

  useEffect(() => {
    loadUsersData(0,10,0);
  }, []);

  const loadUsersData = async (start,end,increase) => {
    try {
      const response = await axios.get(
        `https://dummyjson.com/users?_start=${start}&_end=${end}`
      );
      if (response.data && Array.isArray(response.data.users)) {
        setData(response.data.users);
      } else {
        console.error("Unexpected response structure", response.data);
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching data", err);
      setData([]);
    }
  };

  const sortData = (data) => {
    const { key, direction } = sortConfig;
    return [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = data.filter(
    (item) =>
      (selectedGender === "All" ||
        item.gender === selectedGender.toLowerCase()) &&
      (selectedCountry === "All" || item.address.country === selectedCountry)
  );

  const sortedData = sortData(filteredData);

  const uniqueCountries = [
    ...new Set(data.map((item) => item.address.country)),
  ];

  const renderPagination =() =>{
    if(currentPage ===0){
      return (
        <MDBPagination className="mb-0">
          <MDBPaginationItem>
            <MDBPaginationLink>1</MDBPaginationLink>
          </MDBPaginationItem>
          <MDBDropdownItem>
            <MDBBtn onClick={()=>loadUsersData(10,30,1)}>Next</MDBBtn>
          </MDBDropdownItem>
        </MDBPagination>
      )
    }
  }

  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarBrand href="#">
            <img src="./images.png" alt="Logo" style={{ height: "30px" }} />
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type="button"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setOpenNavBasic(!openNavBasic)}
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar open={openNavBasic}>
            <MDBNavbarNav className="mr-auto mb-2 mb-lg-0">
              {/* add items */}
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer>
        <div style={{ marginTop: "20px" }}>
          <MDBRow className="align-items-center mb-4">
            <MDBCol>
              <h2 className="float-start">Employees</h2>
            </MDBCol>
            <MDBCol size="auto">
              <MDBDropdown className="me-2">
                <MDBDropdownToggle
                  tag="a"
                  className="btn btn-outline-secondary"
                >
                  Gender: {selectedGender}
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem
                    link
                    onClick={() => setSelectedGender("All")}
                  >
                    All
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    link
                    onClick={() => setSelectedGender("Male")}
                  >
                    Male
                  </MDBDropdownItem>
                  <MDBDropdownItem
                    link
                    onClick={() => setSelectedGender("Female")}
                  >
                    Female
                  </MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
            <MDBCol size="auto">
              <MDBDropdown>
                <MDBDropdownToggle
                  tag="a"
                  className="btn btn-outline-secondary"
                >
                  Country: {selectedCountry}
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem
                    link
                    onClick={() => setSelectedCountry("All")}
                  >
                    All
                  </MDBDropdownItem>
                  {uniqueCountries.map((country) => (
                    <MDBDropdownItem
                      key={country}
                      link
                      onClick={() => setSelectedCountry(country)}
                    >
                      {country}
                    </MDBDropdownItem>
                  ))}
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBCol>
          </MDBRow>


          <div>
            {renderPagination}
          </div>
          <MDBRow>
            <MDBCol size="12">
              <MDBTable>
                <MDBTableHead>
                  <tr>
                    <th scope="col" onClick={() => requestSort("id")}>
                      ID
                    </th>
                    <th scope="col">Image</th>
                    <th scope="col" onClick={() => requestSort("firstName")}>
                      Full Name
                    </th>
                    <th scope="col" onClick={() => requestSort("age")}>
                      Demography
                    </th>
                    <th scope="col">Designation</th>
                    <th scope="col">Location</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {sortedData.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    sortedData.map((item) => (
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
                        <td>
                          {item.address.state}, {item.address.country}
                        </td>
                      </tr>
                    ))
                  )}
                </MDBTableBody>
              </MDBTable>
            </MDBCol>
          </MDBRow>
        </div>
      </MDBContainer>
    </>
  );
}

export default App;
