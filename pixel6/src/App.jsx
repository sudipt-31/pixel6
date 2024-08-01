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
  MDBCollapse,
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsersData(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        setCurrentPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const loadUsersData = async (page) => {
    setLoading(true);
    try {
      const start = (page - 1) * 10;
      const response = await axios.get(
        `https://dummyjson.com/users?limit=10&skip=${start}`
      );
      if (response.data && Array.isArray(response.data.users)) {
        const newUsers = response.data.users.filter(
          (user) => !data.some((existingUser) => existingUser.id === user.id)
        );
        const sortedUsers = newUsers.sort((a, b) => a.id - b.id);
        setData((prevData) => [...prevData, ...sortedUsers]);
      } else {
        console.error("Unexpected response structure", response.data);
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
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

          {loading && (
            <div className="text-center mt-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </MDBContainer>
    </>
  );
}

export default App;
