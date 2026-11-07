import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout/Layout.tsx";
import { ResultsPage } from "./pages/ResultsPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ResultsPage />} />
      </Route>
    </Routes>
  );
}
