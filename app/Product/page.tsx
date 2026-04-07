"use client";
import Image from "next/image"
import Link from "next/link"
import ProductNavbar from "../components/ProductNavbar";
import { useState } from "react"

import { products } from "@/app/lib/products"



{/* i chnaged the location of the test data there in lib/products */ }


export default function Page() {
    {/* all the const needed for the app to work for overly and serch function */ }
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)
    const [categoryopen, categorysetOpen] = useState(false)
    const menuOptions = [
        { label: "Categories", onClick: () => categorysetOpen(!categoryopen)},
        {label: "Recent",   onClick: () => {console.log("Sorting by recent")}},        
        {label: "Old",onClick: () => { console.log("Sorting by old")}},
        { label: "Most requested",onClick: () => { console.log("Sorting by Most requested")}},
    ];
  
    const categoryoption = [
        { name: 'phone', src: 'phone.svg', onClick: () => console.log("sorting by categories 'phone'") },
        { name: 'Laptop', src: 'Laptops.svg', onClick: () => console.log("sorting by categories 'phone'") },
        { name: 'Wires', src: 'Wires.svg', onClick: () => console.log("sorting by categories 'Wires'") },
        { name: 'Accessories', src: 'Accessories.svg', onClick: () => console.log("sorting by categories 'Accessories'") },
        { name: 'Camera', src: 'Camera.svg', onClick: () => console.log("sorting by categories 'Camera'") },
        { name: 'Bags', src: 'Bags.svg', onClick: () => console.log("sorting by categories 'Bags'") },



    ];
    const filtered = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()))   

    return (
       
        <main>
    
            {/* the navigation bar on top of the screne */}
            <ProductNavbar search={search} setSearch={setSearch} />
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
                                <button onClick={() => setOpen(!open)}  className=" font-inter font-normal text-[13.3px]  tracking-normal  text-black" >filter</button>
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
                    {filtered.map((product) => (
                        <div key={product.id} className="flex flex-col gap-2 bg-[#F8F8F8] rounded-sm p-4">
                            <Link href={`/Product/${product.id}`} >
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
            {/* the product filter overly it does not filter for now only the serch bar does */}
            {open && (
                <div className="absolute top-20 left-30 bg-[#F4F4F4] border-none rounded-xl p-2 flex flex-col gap-1 z-10">
                    {menuOptions.map((option) => (
                        <div key={option.label} className="flex flex-row items-center gap-2">
                            <Image src="/Vector.svg" alt="vector" height={8} width={8} />

                            <button
                                className="whitespace-nowrap text-sm text-black text-left px-2 py-1.5 rounded-lg hover:bg-[#ebebf2] "
                                onClick={() => { option.onClick(); }} >
                                {option.label}
                            </button>

                            <div className="flex w-full justify-end px-4">
                                <Image src="/arrow filter.svg" alt="arrow" height={24} width={24} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {/* ik i will change the icon another time or u can change them if u want  */ }
            {categoryopen && (
                <div className="gap-8 absolute bg-[#F4F4F4] border-none rounded-xl p-4 top-20 left-85  z-10">
                    <h1 className="text-black font-bold text-sm ">Categories for you</h1>
                    <div className=" grid grid-cols-3 gap-4 ">
                        {categoryoption.map((option) => (
                            <div key={option.name} className="">
                                <button className="hover:bg-[#ebebf2]" onClick={() => { option.onClick(); }}>
                                    <Image src={option.src} alt={option.name} height={45} width={48} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </main>

    )
}
