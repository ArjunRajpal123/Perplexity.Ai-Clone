import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  image?: string;
};

export default function SearchResults({
  results,
}: {
  results: SearchResult[];
}) {
  return (
    <div className="max-w-4xl w-full">
      <h1 className="text-4xl font-bold mb-4 text-primary">Sources</h1>
      <div className="w-full max-w-4xl m-auto mx-auto pb-6">
        <div className="flex space-x-4 p-4 overflow-x max-w-4xl">
          {results.map((result, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-64 h-72 overflow-hidden"
            >
              <Link
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full"
              >
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="relative w-full h-32 mb-4">
                    {result.image ? (
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        className="object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2 line-clamp-2">
                    {result.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {result.snippet}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
