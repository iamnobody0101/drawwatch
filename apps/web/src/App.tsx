import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout/Layout.tsx";
import { DrawDetailPage } from "./pages/DrawDetailPage.tsx";
import { ResultsPage } from "./pages/ResultsPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ResultsPage />} />
        <Route path="draws/:id" element={<DrawDetailPage />} />
      </Route>
    </Routes>
  );
}
