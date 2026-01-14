import { useEffect, useState } from "react";

function clientApi() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/leads")
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error(err));
  }, []);

}

export default clientApi;
