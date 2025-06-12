import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">User Not Found</h2>
        <p className="text-gray-600 mb-4">
          The user you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/" className="text-blue-500 hover:text-blue-600 underline">
          Return Home
        </Link>
      </div>
    </div>
  );
}
