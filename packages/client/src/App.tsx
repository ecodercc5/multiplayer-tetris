import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Welcome, Game } from "./pages";
import { useUser } from "./providers/UserProvider";

function App() {
  const { actions } = useUser();

  useEffect(() => {
    window.addEventListener(
      "beforeunload",
      (e) => {
        e.preventDefault();

        console.log("yur");
        console.log("deleting user");
        actions.deleteUser();

        e.returnValue = "Hello World";
      },
      false
    );

    window.addEventListener("unload", (e) => {
      e.preventDefault();

      console.log("yur");
      actions.deleteUser();

      window.confirm();
    });
  }, [actions]);

  return (
    <>
      <button onClick={() => actions.deleteUser()}>Delete</button>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}

export default App;
