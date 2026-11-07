import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout/Layout.tsx";
import { AboutPage } from "./pages/AboutPage.tsx";
import { DrawDetailPage } from "./pages/DrawDetailPage.tsx";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { ResultsPage } from "./pages/ResultsPage.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ResultsPage />} />
        <Route path="draws/:id" element={<DrawDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
