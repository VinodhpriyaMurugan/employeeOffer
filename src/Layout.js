// components/Layout.js
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <header style={headerStyle}>
        <h1>My Application Header</h1>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>{children}</main>

      {/* Footer */}
      <footer style={footerStyle}>
        <p>My Application Footer</p>
      </footer>
    </div>
  );
};

// Example styles for simplicity
const headerStyle = {
  backgroundColor: "#007BFF",
  color: "white",
  padding: "10px",
  textAlign: "center",
};

const mainStyle = {
  padding: "20px",
  minHeight: "80vh", // Ensures the content area takes up most of the screen
};

const footerStyle = {
  backgroundColor: "#343A40",
  color: "white",
  textAlign: "center",
  padding: "10px",
  position: "relative",
  bottom: "0",
  width: "100%",
};

export default Layout;
