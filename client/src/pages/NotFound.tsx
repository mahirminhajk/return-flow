import { Button } from "@/components/ui/button";
import { ChevronLeft, FileWarning, House } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      {/* Logo */}
      <FileWarning className="text-red-600 lg:h-28 lg:w-28 h-20 w-20" />

      {/* Title */}
      <h1 className="lg:text-4xl text-2xl font-bold mt-3 text-red-600">
        404 - Page Not Found
      </h1>

      {/* Description */}
      <p className="lg:text-lg text-sm mt-2">
        Sorry, the page you are looking for doesn’t exist.
      </p>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        {/* Back Button */}
        <Button
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-lg border border-current"
          variant="outline"
        >
          <ChevronLeft /> Go Back
        </Button>

        {/* Homepage Link */}
        <Button
          onClick={() => navigate("/", { replace: true })}
          className="px-6 py-3 rounded-lg border border-current"
          variant="outline"
        >
          <House /> Go to Homepage
        </Button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-sm">
        &copy; {new Date().getFullYear()} RETURN FLOW. All Rights Reserved.
      </footer>
    </div>
  );
}

export default NotFound;
