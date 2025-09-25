import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import PuffLoader from "react-spinners/PuffLoader";

const CustomOrders = () => {
  
  const [cData, setCData] = useState([]);
  const [loading, setLoading] = useState(true);
  
   useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); 

    console.log(storedUser);

    if (!storedUser?.PrimaryID) {
      console.error("PrimaryID not found in localStorage");
      setLoading(false);
      return;
    }

    console.log(storedUser);
    console.log(storedUser.PrimaryID);
    fetch(`http://localhost:3000/api/emp-records/${storedUser.PrimaryID}`)
      .then((res) => res.json())
      .then((data) => {
        setCData(data);
        setLoading(false);

        setTimeout(() => {
          if ($.fn.DataTable.isDataTable("#DataTables_Table_3")) {
            $("#DataTables_Table_3").DataTable().destroy();
          }
          $("#DataTables_Table_3").DataTable();
        }, 200);
      })
      .catch((err) => {
        console.error("Error fetching delivery notes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <Header />
      <section className="my-4">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h4>Custom Orders</h4>

              <table
                className="table table-bordered"
                id="DataTables_Table_3"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>QUANTITY</th>
                    <th>DESCRIPTION</th>
                    <th>START DATE</th>
                    <th>END DATE</th>
                    <th>REMENING MONTHS</th>
                    <th>MONTHS PAST EXPIRY</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {cData.map((rec, index) => (
                    <tr key={index}>
                      <td>{rec.fieldData?.Date || "-"}</td>
                      <td>{rec.fieldData?.S_No || "-"}</td>
                      <td>{rec.fieldData?.Phone || "-"}</td>
                      <td>{rec.fieldData?.Location || "-"}</td>
                      <td>{rec.fieldData?.NameFirst || "-"}</td>
                      <td>{rec.fieldData?.NameLast || "-"}</td>
                     
                    </tr>
                  ))} */}

                  {cData.length > 0 ? (
                    cData.map((rec, index) => (
                      <tr key={index}>
                        <td>{rec["Employee_vs_Accesories|pk::Date"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Description"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Start_Date"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::End_Date"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Remaining_Months"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::M_Past_Expiry"] || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No Custom Orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
      <Footer />
     {loading && (
        <div className="loading-overlay">
          <PuffLoader color="#ffffffff" size={80} />
          <p className="mt-3 fw-bold text-white">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default CustomOrders;
