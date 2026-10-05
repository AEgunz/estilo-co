import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router";
import Home from "./pages/Home";

const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    const isAdmin = pathname.startsWith("/admin");
    document.documentElement.dir = isAdmin ? "ltr" : "rtl";
    document.title = isAdmin ? "لوحة الطلبات | ESTILO-CO" : "ساعة الحية النسائية | Estilo-Co Watch";
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
    </Routes>
  );
}
