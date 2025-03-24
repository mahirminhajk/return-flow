import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

interface ListImagesCardProps {
  data: {
    _id: string;
    name: string;
    description?: string;
    price?: string;
    img: string;
  }[];
  handleDeletePoster: (id: string) => void;
}

function ListImagesCard({ data, handleDeletePoster }: ListImagesCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((poster) => (
        <Card key={poster._id} className="relative">
          <img
            src={`${import.meta.env.VITE_API_URL}/img/${poster.img}`}
            alt={poster.name}
            className="w-full max-h-48 object-cover rounded-t-lg"
          />
          <CardHeader className="p-4">
            <CardTitle className="text-lg">{poster.name}</CardTitle>
            <CardDescription className="text-gray-500">
              {poster.description && (
                <p className="text-sm">DESCRIPTION: {poster.description}</p>
              )}
              {poster.price && <p className="text-sm">PRICE: {poster.price}</p>}
            </CardDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              onClick={() => handleDeletePoster(poster._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export default ListImagesCard;
