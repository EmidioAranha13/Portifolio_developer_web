import React from "react";
import FloatingScene from "./componentes/FloatingBalls/FloatingBalls"; // ajuste o caminho conforme sua estrutura
import StyledHeader from "./componentes/StyledHeader/StyledHeader";
import "./App.css";
function App() {
  return (
    <div className="App">
      <FloatingScene>
        <div className="content">
        <StyledHeader />
        <h1>
          Bem Vindo !
        </h1>
        </div>
      </FloatingScene>
    </div>
  );
}

export default App;
