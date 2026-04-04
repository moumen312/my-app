"use client";
import Image from "next/image"
import Link from "next/link"
import ProductNavbar from "../components/ProductNavbar";
import { useState } from "react"


{/* varibale declaration  */ }
type Product = {
    id: number
    name: string
    price: number
    image: string
    available: boolean
}
{/* the array used to test the product grid */ }
const products: Product[] = [
    { id: 1, name: "Samsung Galaxy A54", price: 75.000, image: "/s-l1200 1.svg", available: true },
    { id: 2, name: "iPhone 13", price: 180.000 , image: "/phone 2 .svg", available: false },
    { id: 3, name: "Asus VivoBook 15", price: 105.000 , image: "/laptop 1.svg", available: true },
    { id: 4, name: "HP Laptop i5", price: 120.000 , image: "/laptop 2.svg", available: true },
    { id: 5, name: "USB-C Fast Charging Cable", price: 1.200 , image: "/usbcable.svg", available: false },
    { id: 6, name: "HDMI Cable 2m", price: 1.500 , image: "/hdmicable.svg", available: false },
    
]




export default function Page() {
    const [open, setOpen] = useState(false)
    return (
        
        <main>
            
            {/* the navigation bar on top of the screne */}
            <ProductNavbar />
            <section className="min-h-screen bg-[#ebebf2]">
                <div className="flex flex-row items-start px-16 pt-4">
                    {/* the top left side :titel/filter etc */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-4">
                            <div className=" flex items-center justify-center ">
                                <h1 className="font-inter font-bold text-[19.1px]  tracking-normal text-black" >Welcome to Techy.com</h1>
                            </div>
                        </div>
                        <div className="flex flex-row gap-16">
                            <div className=" flex items-center justify-center gap-2">
                                <Image src="/sort line.svg" alt="filter" width={16} height={16} />
                                <button onClick={() => setOpen(!open)} className=" font-inter font-normal text-[13.3px]  tracking-normal  text-black" >filter</button>
                            </div>
                            <div className=" flex items-center justify-center ml-auto">
                                <Link href="/#" className=" font-inter font-normal text-[13.3px] tracking-normal text-black" >Find factories</Link>
                            </div>
                            <div className=" flex items-center justify-center ml-auto">
                                <Link href="/#" className=" font-inter font-normal text-[13.3px] tracking-normal text-black " >Order protections</Link>
                            </div>
                        </div>
                    </div>
                    {/* the text at the middle top */}
                    <div className="flex flex-col justify-center ml-[13%]  ">
                        <h1 className="font-instrument italic text-4xl  font-bold bg-linear-to-r from-[#0072FF]  to-[#4000FF]  text-transparent bg-clip-text pb-1 px-1 ">Products</h1>
                    </div>
                    {/* the text at the right top :sing in and creat acount */}
                    <div className="flex flex-col  ml-auto">
                        <div className="flex flex-row gap-4 items-center justify-center">
                            <div className="flex flex-row gap-2">
                                <Image src="/perosn.svg" alt="user" width={12} height={12} />
                                <Link href="/#" className="text-[13.2px] text-black ">Sign in</Link>
                            </div>
                            <div className="px-2 py-0.5 bg-[#60A5FA] flex items-center rounded-xl ">
                                <Link href="/#" className=" text-[10px] text-white ">Create account</Link>
                            </div>
                        </div>
                    </div>
                </div>
                {/* the product desplay grid */}
                <div className="grid grid-cols-4 gap-12 mt-[8%] px-16 py-4">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col gap-2 bg-[#F8F8F8] rounded-sm p-4">
                            <Link href={`/product/${product.id}`} >
                                <h2 className="text-black font-bold">{product.name}</h2>
                                <p className="text-black ">{product.price.toFixed(3)} DA</p>
                                <div className="relative w-full aspect-square">
                                    <Image src={product.image} alt={product.name} fill className="object-cover  rounded-lg" />
                                </div>
                            </Link>
                            <div className={`self-end px-3 py-1 rounded-xl text-center items-center  ${product.available ? "bg-green-400" : "bg-red-400"}`}>
                                <span className="text-sm font-medium  text-black">
                                    {product.available ? "Available" : "Sold out"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            {/* the product filter overly */}
            {open && (
                <div className="absolute top-34 left-34 bg-[#F4F4F4] border-none rounded-xl p-2 flex flex-col gap-1 z-10">
                    {["Categories", "Recent", "Old", "Most requested"].map((option) => (
                        <div key={option} className="flex flex-row gap-2">
                            <Image src="/Vector.svg" alt="vector" height={8} width={8} />
                        <button

            
                            className="whitespace-nowrap text-sm text-black text-left px-2 py-1.5 rounded-lg hover:bg-[#ebebf2]"
                            onClick={() => {
                                console.log("Sort by:", option)
                                setOpen(false)
                            }}
                        >
                            {option}
                        </button>
                        <div className="flex w-full justify-end px-4 ">
                          <Image src="/arrow filter.svg" alt="vector" height={24} width={24} />
                          </div>
                        </div>
                    ))}
                </div>
            )}
        </main>

    )
}
