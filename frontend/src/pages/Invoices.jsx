import React, { useEffect, useState } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import PuffLoader from "react-spinners/PuffLoader";

const Invoices = () => {

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
              <h4>Invoices</h4>

              <table
                className="table table-bordered"
                id="DataTables_Table_3"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Invoice No.</th>
                    <th>Amount</th>
                    <th>Amount Paid</th>
                    <th>Balance O/S</th>
                    <th>View Invoice</th>
                    <th>View Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {cData.length > 0 ? (
                    cData.map((rec, index) => (
                      <tr key={index}>
                        <td>{rec["Employee_vs_Accesories|pk::Date"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Invoice_No"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Amount"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Paid"] || "-"}</td>
                        <td>{rec["Employee_vs_Accesories|pk::Balance_OS"] || "-"}</td>
                        <td><a href='#' className="btn btn-sm btn-primary">View</a></td>
                        <td><a href='#' className="btn btn-sm btn-danger">View</a></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No Invoices found
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

export default Invoices;
