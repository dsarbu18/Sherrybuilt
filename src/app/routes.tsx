import { createHashRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { QuoteRequest } from "./components/QuoteRequest";
import { OurStory } from "./components/OurStory";
import { Portfolio } from "./components/Portfolio";
import { PortfolioAdmin } from "./components/PortfolioAdmin";
import { NotFound } from "./components/NotFound";

// Using HashRouter for GitHub Pages compatibility
// URLs will be: https://sheridanbuilt.ca/#/, https://sheridanbuilt.ca/#/quote, etc.
// Works both locally (localhost:5173/#/) and on GitHub Pages
export const router = createHashRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "quote", Component: QuoteRequest },
      { path: "our-story", Component: OurStory },
      { path: "portfolio", Component: Portfolio },
      // Admin page — intentionally hidden from navigation
      { path: "admin", Component: PortfolioAdmin },
      { path: "*", Component: NotFound },
    ],
  },
]);
