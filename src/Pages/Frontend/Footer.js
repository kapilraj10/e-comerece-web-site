import React from "react";

const Footer = () => {
  return (
    <footer className="bg-body-tertiary text-center">
      <div className="container p-4">
      </div>
    

      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        © {new Date().getFullYear()} Copyright: 
        <a className="text-body" href="#">
          ProteinPulse
        </a>
      </div>
    </footer>
  );
};

export default Footer;
