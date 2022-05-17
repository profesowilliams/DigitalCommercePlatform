import React from "react";
import { BuildForm } from "@tdsynnex/forms";

const App = () => {
  const completeFormTestJson = JSON.parse(
    document.getElementById("root").dataset.config
  );
  return <BuildForm configuration={completeFormTestJson} />;
};

export default App;
