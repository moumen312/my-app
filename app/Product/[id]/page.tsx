
import ProductNavbar from "@/app/components/ProductNavbar"
import Purchesbutton from "@/app/components/purchesbutton"
import { products } from "@/app/lib/products"
import Image from "next/image"
{/* the custom id page it work for now */ }
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const product = products.find((p) => p.id === Number(id))
    if (!product) return <div>Product not found</div>

    return (

        <main>
            <ProductNavbar />
            <section className="min-h-screen bg-[#ebebf2]">
                <div className="ps-4 pt-4 text-black flex flex-col  gap-y-6">
                    <div className="flex flex-row gap-12">
                        <Image src={product.image} alt={product.name} width={350} height={350} />
                        {product.discount != '0' && (
                            <div className="flex h-fit bg-red-600  text-balck font-bold  px-4 rounded">
                                <span>SOLD : {product.discount} %</span>
                            </div>)}
                            {/* disscount only appere whene there is one  */ }
                    </div>
                    <div className="flex flex-row gap-[10%]">
                        <h1 className="font-bold text-3xl">{product.name}</h1>
                        <div className="flex flex-col gap-4">
                            <p className="text-3xl">{product.price.toFixed(3)} DA</p>
                            <Purchesbutton />
                        </div>
                    </div>
                    <div className="flex flex-row gap-6">

                        <p className="text-xl w-auto">Description : {product.description}</p>

                    </div>

                </div>
            </section>
        </main>
    )
}
