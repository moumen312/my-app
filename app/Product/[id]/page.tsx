"use client";
import ProductNavbar from "../../components/ProductNavbar";
import ProductDetails from "../../components/ProductDetails";

export default function Page() {
  return (
    <main>
      <ProductNavbar />
      <div className="min-h-screen bg-gray-50">
        <ProductDetails />
      </div>
    </main>
  );
}
