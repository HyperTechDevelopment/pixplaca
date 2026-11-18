import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: rota inexistente:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl font-extrabold text-foreground">404</h1>
        <p className="mb-4 mt-2 text-muted-foreground">Página não encontrada.</p>
        <Link to="/" className="font-bold text-primary underline-offset-4 hover:underline">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
