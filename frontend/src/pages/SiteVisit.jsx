import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import PuffLoader from "react-spinners/PuffLoader";

const SiteVisit = () => {
  const [cData, setCData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/sitevisit")
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
        console.error("Error fetching client:", err);
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
              <h4>SITE VISIT</h4>

              <table
                className="table table-bordered"
                id="DataTables_Table_3"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>NOTES</th>
                    <th>CONTACT PERSON</th>
                    <th>CONTACT PHONE NUMBER</th>
                    <th>EMAIL</th>
                    <th>ADDRESS FOR SITE VISIT</th>
                  </tr>
                </thead>
                <tbody>
                  {cData.length > 0 ? (
                    cData.map((rec, index) => (
                      <tr key={index}>
                        <td>{rec.fieldData?.Date || "-"}</td>
                        <td>{rec.fieldData?.Cell || "-"}</td>
                        <td>{rec.fieldData?.NameFirst || "-"}</td>
                        <td>{rec.fieldData?.Phone || "-"}</td>
                        <td>{rec.fieldData?.Email || "-"}</td>
                        <td>{rec.fieldData?.Address || "-"}</td>
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No records found
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

export default SiteVisit
