import React, { useState } from "react";
import VendorTable from "./components/VendorTable";
import "antd/dist/antd.css";

function App() {
  const [data, setData] = useState([
    {
      key: "1",
      name: "Box",
      num_applications: 2,
      total_spend_ytd: 20000,
      contract_active: true,
      source: "Excel",
      total_spend_year: 200000,
      contract_value: 1000000,
      applications: {
        isTable: true,
        values: [
          {
            key: "1",
            name: "Loom",
            vendor: "Box",
            category: "Video CMS Software",
            licenses_bought: 0,
            covered: false,
            billing_frequency: "annually",
            payment_terms: "",
          },
          {
            key: "2",
            name: "Zoom",
            vendor: "Box",
            category: "Screen Sharing Software",
            licenses_bought: 0,
            covered: false,
            billing_frequency: "annually",
            payment_terms: "",
          },
        ],
      },
    },
    {
      key: "2",
      name: "Apple Store",
      num_applications: 4,
      total_spend_ytd: 20000,
      contract_active: false,
      source: "Quick Books",
      total_spend_year: 200000,
      contract_value: 1000000,
      applications: {
        isTable: true,
        values: [
          {
            key: "1",
            name: "Calendly",
            vendor: "Apple Store",
            category: "Appointment Scheduling Software",
            licenses_bought: 0,
            covered: false,
            billing_frequency: "annually",
            payment_terms: "",
          },
          {
            key: "2",
            name: "Hubspot",
            vendor: "Apple Store",
            category: "Conversational Marketing Software",
            licenses_bought: 1,
            covered: true,
            billing_frequency: "annually",
            payment_terms: "",
          },
          {
            key: "3",
            name: "eBay",
            vendor: "Apple Store",
            category: "Appointment Scheduling Software",
            licenses_bought: 0,
            covered: false,
            billing_frequency: "annually",
            payment_terms: "",
          },
        ],
      },
    },
  ]);

  return (
    <>
      <VendorTable data={data} setData={setData} />
    </>
  );
}

export default App;
