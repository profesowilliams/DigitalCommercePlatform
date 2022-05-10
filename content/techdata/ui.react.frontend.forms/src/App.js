import React from "react";
import { BuildForm } from "@tdsynnex/forms";

// This component is the application entry point
const App = () => {
  const completeFormTestJson = JSON.parse(
    document.getElementById("root").dataset.config
  );
  return <BuildForm configuration={completeFormTestJson} />;
};

export default App;
