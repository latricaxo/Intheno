import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

import Index from "./pages/Index";
import SearchPage from "./pages/SearchPage";
import ExplorePage from "./pages/ExplorePage";
import CategoryPage from "./pages/CategoryPage";
import ContributePage from "./pages/ContributePage";
import ContributionsPage from "./pages/ContributionsPage";
import ContributorPage from "./pages/ContributorPage";
import KnowledgeDetailPage from "./pages/KnowledgeDetailPage";
import RequestPage from "./pages/RequestPage";
import AboutPage from "./pages/AboutPage";
import SupportPage from "./pages/SupportPage";
import { NIP19Page } from "./pages/NIP19Page";
import NotFound from "./pages/NotFound";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/knowledge/:id" element={<KnowledgeDetailPage />} />
        <Route path="/contribute" element={<ContributePage />} />
        <Route path="/contributions" element={<ContributionsPage />} />
        <Route path="/contributor/:npub" element={<ContributorPage />} />
        <Route path="/request" element={<RequestPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/support" element={<SupportPage />} />
        {/* NIP-19 route for npub1, note1, naddr1, nevent1, nprofile1 */}
        <Route path="/:nip19" element={<NIP19Page />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRouter;
