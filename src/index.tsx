import { createRoot } from "react-dom/client";
import './scss/styles.scss';
import Home from "./pages/Home.tsx";

const container = document.getElementById("root");
// @ts-ignore
const root = createRoot(container);

root.render(<Home />);
