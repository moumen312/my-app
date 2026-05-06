"use client";
import ProductNavbar from "../../components/ProductNavbar";
import ProductDetails from "../../components/ProductDetails";
import { useParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();

  return (
    <main>
      <ProductNavbar />
      <div className="min-h-screen bg-gray-50">
        <ProductDetails id={id as string} />
      </div>
    </main>
  );
}
