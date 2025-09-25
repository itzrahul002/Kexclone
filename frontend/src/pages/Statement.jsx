import React, { useState, useEffect } from "react";
import $ from "jquery";
import "datatables.net-bs4";
import { Form, Button } from "react-bootstrap";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
const Statement = () => {
  const [invoiceType, setInvoiceType] = useState(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [cData, setCData] = useState([]);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const primaryKey = storedUser?.PrimaryID;



  useEffect(() => {
  const table = $("#DataTables_Table_3");

  if ($.fn.DataTable.isDataTable(table)) {
    const dataTable = table.DataTable();
    dataTable.clear();              // clear old data
    dataTable.rows.add(cData);      // add new rows
    dataTable.draw();               // redraw table
  } else {
    table.DataTable({
      data: cData,
      columns: [
        { data: "Employee_vs_Accesories|pk::Date", defaultContent: "-" },
        { data: "Employee_vs_Accesories|pk::Description", defaultContent: "-" },
        { data: "Employee_vs_Accesories|pk::Phone", defaultContent: "-" },
        { data: "Employee_vs_Accesories|pk::Phone", defaultContent: "-" },
        { data: "Employee_vs_Accesories|pk::Email", defaultContent: "-" },
        { data: "Employee_vs_Accesories|pk::Address", defaultContent: "-" },
      ],
      paging: true,
      searching: true,
      ordering: true,
    });
  }
}, [cData]);




  const fetchData = () => {
    if (!primaryKey) {
      console.error("PrimaryID missing");
      return;
    }

     if (!fromDate && !toDate && !invoiceType) {
      alert("Please select Invoice Type Or Date.");
      return;
    }

    if (fromDate && !toDate) {
      alert("Please select To Date.");
      return;
    }

    if (!fromDate && toDate) {
      alert("Please select From Date.");
      return;
    }

   

    const query = new URLSearchParams({
      invoiceType: invoiceType || "",
      fromDate,
      toDate,
      _: Date.now(),
    }).toString();

    fetch(`http://localhost:3000/api/statement/${primaryKey}?${query}`)
    
      .then((res) => res.json())
      .then((data) => {
        setCData(data);
      })
      .catch((err) => console.error("Error fetching statement:", err));
  };

 const handleClear = () => {
  setInvoiceType(null);
  setFromDate("");
  setToDate("");
  setCData([]); // clear table

  const table = $("#DataTables_Table_3");
  if ($.fn.DataTable.isDataTable(table)) {
    table.DataTable().clear().destroy();
  }
};


  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-3">
              <div className="bg_add pb-4">
                <div className="row g-3 pt-2">
                  {/* Invoice Type */}
                  <div className="col-lg-4 col-md-12 d-flex align-items-center">
                    <div className="d-flex gap-3">
                      <Form.Check
                        type="radio"
                        label="All Invoices"
                        value="all"
                        name="invoiceType"
                        checked={invoiceType === "all"}
                        onChange={(e) => setInvoiceType(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        label="Outstanding"
                        value="outstanding"
                        name="invoiceType"
                        checked={invoiceType === "outstanding"}
                        onChange={(e) => setInvoiceType(e.target.value)}
                      />
                      <Form.Check
                        type="radio"
                        label="Paid"
                        value="paid"
                        name="invoiceType"
                        checked={invoiceType === "paid"}
                        onChange={(e) => setInvoiceType(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* From Date */}
                  <div className="col-lg-4 col-md-6">
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </div>

                  {/* To Date */}
                  <div className="col-lg-4 col-md-6">
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="col-md-12 text-center mt-3">
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={fetchData}
                     
                    >
                      Submit
                    </Button>
                    <Button variant="danger" onClick={handleClear}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="my-4">
        <div className="container">
          <h4>STATEMENT</h4>
          <table className="table table-bordered" id="DataTables_Table_3">
            <thead>
              <tr>
                <th>DATE</th>
                <th>NOTES</th>
                <th>CONTACT PERSON</th>
                <th>PHONE</th>
                <th>EMAIL</th>
                <th>ADDRESS</th>
              </tr>
            </thead>
            <tbody>
             
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </>
  );
};





export default Statement
