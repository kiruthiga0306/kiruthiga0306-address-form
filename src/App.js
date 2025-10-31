
import React, { useState, useEffect } from "react";
export default function App() {
  const initial = {
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  };
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [savedMsg, setSavedMsg] = useState("");
  const storageKey = "shippingAddress";
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setData(JSON.parse(saved));
    } catch (e) {
    }
  }, []);
  function validate(values) {
    const e = {};
    if (!values.fullName.trim()) e.fullName = "Full Name is required.";
    if (!/^\d{10}$/.test(values.phone)) e.phone = "Phone must be 10 digits.";
    if (!values.street.trim()) e.street = "Street Address is required.";
    if (!values.city.trim()) e.city = "City is required.";
    if (!values.state.trim()) e.state = "State is required.";
    if (!/^\d{6}$/.test(values.pincode)) e.pincode = "Pincode must be 6 digits.";
    return e;
  }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === "phone" || name === "pincode") {
      const cleaned = value.replace(/\D/g, "");
      setData((d) => ({ ...d, [name]: cleaned }));
    } else {
      setData((d) => ({ ...d, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setSavedMsg("");
  }
  function handleSubmit(evt) {
    evt.preventDefault();
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      setSavedMsg("Address saved successfully ✅");
      setTimeout(() => setSavedMsg(""), 3000);
    } catch (err) {
      setSavedMsg("Failed to save address.");
    }
  }
  function handleClear() {
    setData(initial);
    setErrors({});
    localStorage.removeItem(storageKey);
    setSavedMsg("Address cleared.");
    setTimeout(() => setSavedMsg(""), 2000);
  }
  return (
    <div style={styles.page}>
      <h2>Shipping Address Form</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <Label name="Full Name" error={errors.fullName}>
          <input
            name="fullName"
            value={data.fullName}
            onChange={handleChange}
            style={styles.input}
            placeholder="John Doe"
          />
        </Label>
        <Label name="Phone (10 digits)" error={errors.phone}>
          <input
            name="phone"
            value={data.phone}
            onChange={handleChange}
            style={styles.input}
            placeholder="9876543210"
            maxLength={10}
          />
        </Label>
        <Label name="Street Address" error={errors.street}>
          <input
            name="street"
            value={data.street}
            onChange={handleChange}
            style={styles.input}
            placeholder="123, ABC street"
          />
        </Label>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Label name="City" error={errors.city}>
              <input
                name="city"
                value={data.city}
                onChange={handleChange}
                style={styles.input}
                placeholder="Chennai"
              />
            </Label>
          </div>
          <div style={{ flex: 1 }}>
            <Label name="State" error={errors.state}>
              <input
                name="state"
                value={data.state}
                onChange={handleChange}
                style={styles.input}
                placeholder="Tamil Nadu"
              />
            </Label>
          </div>
        </div>
        <Label name="Pincode (6 digits)" error={errors.pincode}>
          <input
            name="pincode"
            value={data.pincode}
            onChange={handleChange}
            style={styles.input}
            placeholder="600001"
            maxLength={6}
          />
        </Label>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button type="submit" style={styles.buttonPrimary}>
            Save Address
          </button>
          <button type="button" onClick={handleClear} style={styles.button}>
            Clear
          </button>
        </div>
        {savedMsg && <div style={styles.savedMsg}>{savedMsg}</div>}
      </form>
      <div style={styles.summary}>
        <h3>Saved Address (summary)</h3>
        {Object.values(data).some(Boolean) ? (
          <div>
            <div><b>{data.fullName}</b></div>
            <div>{data.phone}</div>
            <div>{data.street}</div>
            <div>{data.city}, {data.state} - {data.pincode}</div>
          </div>
        ) : (
          <div>No address saved yet.</div>
        )}
      </div>
    </div>
  );
}
function Label({ children, name, error }) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ marginBottom: 6 }}>{name} {error && <span style={{ color: "crimson" }}> - {error}</span>}</div>
      {children}
    </label>
  );
}
const styles = {
  page: { maxWidth: 720, margin: "30px auto", fontFamily: "Arial, sans-serif", padding: 12 },
  form: { background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  input: { width: "100%", padding: "8px 10px", fontSize: 14, borderRadius: 4, border: "1px solid #ccc" },
  buttonPrimary: { background: "#1976d2", color: "#fff", border: "none", padding: "8px 14px", borderRadius: 4 },
  button: { background: "#eee", border: "none", padding: "8px 14px", borderRadius: 4 },
  savedMsg: { marginTop: 10, color: "#0a7f2a" },
  summary: { marginTop: 20, padding: 12, border: "1px solid #eee", borderRadius: 6, background: "#fafafa" },
};