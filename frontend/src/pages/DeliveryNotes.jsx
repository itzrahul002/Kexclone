import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import PuffLoader from "react-spinners/PuffLoader";

const DeliveryNotes = () => {
  const [notes, setNotes] = useState([]);
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
        setNotes(data);
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
              <h4>Delivery Notes</h4>

              <table
                className="table table-bordered"
                id="DataTables_Table_3"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>DELIVERY NOTE NO.</th>
                    <th>DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.length > 0 ? (
                    notes.map((rec, index) => (
                      <tr key={index}>
                        <td>{rec["Employee_vs_Accesories|pk::Date"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Delivery_Note_No"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Description"] || "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No delivery notes found
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

export default DeliveryNotes;
