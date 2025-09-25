import React, { useState, useEffect, useContext } from "react";
import { useLocation, UNSAFE_NavigationContext as NavigationContext } from "react-router-dom";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import PuffLoader from "react-spinners/PuffLoader";
import "../App.css";

function useBlocker(blocker, when = true) {
  const navigator = useContext(NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const push = navigator.push;
    const replace = navigator.replace;

    navigator.push = (...args) => {
      if (blocker()) return;
      push(...args);
    };
    navigator.replace = (...args) => {
      if (blocker()) return;
      replace(...args);
    };

    return () => {
      navigator.push = push;
      navigator.replace = replace;
    };
  }, [navigator, blocker, when]);
}

function usePrompt(message, when) {
  useBlocker(() => {
    if (window.confirm(message)) {
      return false; 
    }
    return true;
  }, when);
}

const Home = () => {
  const location = useLocation();
  const isEdit = location.pathname.includes("/edit/home");
  const [isDirty, setIsDirty] = useState(false);

  const [cData, setCData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  usePrompt("You have unsaved changes. Do you really want to leave?", isDirty);

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/records")
      // .then((res) => res.json())
      // .then((data) => setCData(data))
      // .catch((err) => console.error("Error fetching client:", err))
      // .finally(() => setLoading(false));
  // }, []);

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
    fetch(`http://localhost:3000/api/records/${storedUser.PrimaryID}`)
          .then((res) => res.json())
          .then((data) => setCData(data))

          .catch((err) => console.error("Error fetching client:", err))
          .finally(() => setLoading(false));
  }, []);

  const handleChange = (recordId, field, value) => {
    setIsDirty(true);
    setCData((prev) =>
      prev.map((rec) =>
        rec.recordId === recordId
          ? { ...rec, fieldData: { ...rec.fieldData, [field]: value } }
          : rec
      )
    );
  };

  const handleSave = async (rec) => {
    setLoading(true);
    try {
      setIsDirty(false);
      const cleanFieldData = {
        NameFirst: rec.fieldData.NameFirst || ""
      };

      const response = await fetch(`http://localhost:3000/api/records/${rec.recordId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldData: cleanFieldData }),
      });

      console.log("Response status:", response.status);
      console.log("Response recid:", rec.recordId);

      const result = await response.json();
      console.log("Response result:", result);

      if (result.success) {
        alert("Record updated successfully!");
        setLoading(false);
      } else {
        alert("Failed to update record");
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      console.error("Error saving record:", err);
      alert("Error while saving record");
    }
  };

  return (
    <>
      <Header />

      <div className={`content-wrap${loading ? " blurred" : ""}`}>
        <main>
          {cData.map((rec) => (
            <section className="my-4 pb-3" key={rec.recordId}>
              <div className="container">
                {/* Name Section */}
                <div className="fw-bold mb-1 fs-5">
                  <h6>Client No. {rec.fieldData.S_No}</h6>
                  <h6>{rec.fieldData.NameFirst}</h6>
                  <h6>{rec.fieldData.NameFirstLast_c}</h6>
                </div>
                {isEdit && (
                  <div className="mt-3">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleSave(rec)}
                    >
                      Save
                    </button>
                  </div>
                )}

                {/* Client Details */}
                <div className="col-md-12 mb-3">
                  <h3 className="hd_txt">Client Details</h3>
                  <div className="bg_add p-3">
                    <div className="row">
                      {[
                        { label: "Client ID", field: "ClientId", readOnly: true },
                        { label: "Client Name", field: "NameFirst" },
                        { label: "Sub Category", field: "Category" },
                        { label: "Sub Name", field: "NameLast" },
                      ].map(({ label, field, readOnly }) => (
                        <div className="col-lg-3 col-md-4 col-12" key={field}>
                          <div className="form-group">
                            <label>{label}</label>
                            <input
                              type="text"
                              className="form-control"
                              disabled={!isEdit || readOnly}
                              value={rec.fieldData[field] || ""}
                              onChange={(e) =>
                                handleChange(rec.recordId, field, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Billing Info */}
                <div className="col-md-12">
                  <h3 className="hd_txt">Billing Info</h3>
                  <div className="bg_add p-3">
                    <div className="row">
                      {[
                        { label: "Name", field: "NameFirstLast_c" },
                        { label: "Position", field: "Position" },
                        { label: "Cell", field: "Cell" },
                        { label: "Phone", field: "Phone" },
                        { label: "Extension", field: "Ext" },
                        { label: "Email", field: "Email" },
                      ].map(({ label, field }) => (
                        <div className="col-lg-3 col-md-4 col-12" key={field}>
                          <div className="form-group">
                            <label>{label}</label>
                            <input
                              type="text"
                              className="form-control"
                              disabled={!isEdit}
                              value={rec.fieldData[field] || ""}
                              onChange={(e) =>
                                handleChange(rec.recordId, field, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <div className="col-md-6 col-sm-12 col-12">
                        <div className="form-group">
                          <label>Billing Address</label>
                          <textarea
                            className="form-control"
                            disabled={!isEdit}
                            value={rec.fieldData.Address || ""}
                            onChange={(e) =>
                              handleChange(rec.recordId, "Address", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="col-md-12 mt-3">
                  <h3 className="hd_txt">Delivery Info</h3>
                  <div className="bg_add p-3">
                    <div className="row">
                      {[
                        { label: "Name", field: "NameFirstLast_c" },
                        { label: "Position", field: "Position" },
                        { label: "Cell", field: "Cell" },
                        { label: "Phone", field: "Phone" },
                        { label: "Extension", field: "Ext" },
                        { label: "Email", field: "Email" },
                      ].map(({ label, field }) => (
                        <div className="col-lg-3 col-md-4 col-12" key={field}>
                          <div className="form-group">
                            <label>{label}</label>
                            <input
                              type="text"
                              className="form-control"
                              disabled={!isEdit}
                              value={rec.fieldData[field] || ""}
                              onChange={(e) =>
                                handleChange(rec.recordId, field, e.target.value)
                              }
                            />
                          </div>
                        </div>
                      ))}

                      <div className="col-md-6 col-sm-12 col-12">
                        <div className="form-group">
                          <label>Delivery Address</label>
                          <textarea
                            className="form-control"
                            disabled={!isEdit}
                            value={rec.fieldData.Address || ""}
                            onChange={(e) =>
                              handleChange(rec.recordId, "Address", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          ))}
        </main>
      </div>

      <Footer />

      {/* Loader Overlay */}
     {loading && (
        <div className="loading-overlay">
          <PuffLoader color="#ffffffff" size={80} />
          <p className="mt-3 fw-bold text-white">Loading...</p>
        </div>
      )}
    </>
  );
};

export default Home;
