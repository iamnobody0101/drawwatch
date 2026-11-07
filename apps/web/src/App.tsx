import { ServerStatus } from "./components/ServerStatus/ServerStatus.tsx";
import { ResultsPage } from "./pages/ResultsPage.tsx";

export default function App() {
  return (
    <main>
      <ServerStatus />
      <ResultsPage />
    </main>
  );
}
