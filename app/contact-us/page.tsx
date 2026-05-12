"use client";
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Page() {

    return (
        <main>
            <Navbar/>
        <section className="relative min-h-screen bg-[#090D18]">
            
            <div className="flex flex-row items-start px-0 ">
                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col w-fit flex-1 text-white">
                    <h1 className="ml-[25%] mt-12 font-inter font-normal text-[50px] leading-[100%] tracking-[0%] align-middle">Get in Touch</h1>
                    <p className="ml-[26%] mt-18 font-normal text-[39px] leading-[49.16px] w-[414]">We’re here to help! Contact us anytime for support, questionsor inquiries.</p>
                </div>
                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col  flex-2">
                    <div className="mt-[5%] text-white ml-[40%] mb-[5%] grid w-fit grid-cols-3 gap-x-[32] ">
                        <Link className="underline" href="https://fr.pinterest.com/thegreatcat/white-cats/">Facebook
                        </Link>
                        <Link className="underline" href="https://www.instagram.com/_chichi.nia_29/">Instagram
                        </Link>
                        <Link className="underline" href="https://solo-leveling.fandom.com/wiki/Igris">LinkedIn
                        </Link>
                    </div>
                    <div className="mt-[5%] ml-[30%] mb-[5%] grid w-fit grid-cols-3 gap-x-[32] ">
                        <div className="flex flex-col" >
                            <label className="text-white text-sm font-medium">First Name</label>
                            <input
                                type="text"
                                placeholder=""
                                className="bg-[#ffff] border border-[#3B82F633]  px-4 py-3 text-black placeholder-[#94A3B8] outline-none focus:border-[#60A5FA] transition-colors" />
                        </div>
                        <div className="flex flex-col" >
                            <label className="text-white text-sm font-medium">Last Name</label>
                            <input
                                type="text"
                                placeholder=""
                                className="bg-[#ffff] border border-[#3B82F633]  px-4 py-3 text-black placeholder-[#94A3B8] outline-none focus:border-[#60A5FA] transition-colors" />
                        </div>
                    </div>
                    <div className="mt-[0%] ml-[30%] mb-[5%]" >
                        <div className="flex flex-col" >
                            <label className="text-white text-sm font-medium">Email</label>
                            <input
                                type="text"
                                placeholder=""
                                className="bg-[#ffff] border w-[410] border-[#3B82F633]  px-4 py-3 text-black placeholder-[#94A3B8] outline-none focus:border-[#60A5FA] transition-colors" />
                        </div>
                        <div className="mt-[6%] mb-[5%]" >
                            <div className="flex flex-col" >
                                <label className="text-white text-sm font-medium">Message</label>
                                <input
                                    type="text"
                                    placeholder=""
                                    className="bg-[#ffff] border w-[410] h-[100] border-[#3B82F633]  px-4 py-3 text-black placeholder-[#94A3B8] outline-none focus:border-[#60A5FA] transition-colors" />
                            </div>
                        </div >

                        <button className="ml-[45%] bg-[#60A5FA] border  border-amber-50 text-white py-2 px-4 rounded-[35] hover:bg-[#3B82F6] transition-colors">
                            Send Message
                        </button>
                    </div>


                </div>
            </div>

            <div className="flex  ml-[5%]  border-b-2 w-[90%] 
       "style={{ borderColor: "#FFFFFF" }}>
            </div>
            <div className="flex flex-row items-start px-0 ">
                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col w-fit flex-1">
                    <div className="gird grid-cols-2 w-auto ">
                        <div className=" flex flex-row ml-[5%] mt-[2%] gap-4">  {/* the icon with the text  */}
                            <Image
                                src="/phone contact.svg" alt="clock" width={34} height={34} style={{ width: "auto", height: "auto" }} />
                            <div className="font-bold text-[24px] leading-[33.6px] tracking-[-0.5px] text-[#FFFF]"
                                style={{ fontFamily: "var(--font-dm-sans)" }}>  {/* the 2 lines of text   */}
                                <p className="">Phone No:</p>
                                <p className="mt-2 font-normal text-[#FFFF] text-[22.8px] leading-[19.2px] tracking-normal align-middle"
                                    style={{ fontFamily: "var(--font-dm-sans)" }}>
                                    +123 456 7890
                                </p>
                            </div>
                            <div className=" flex flex-row  gap-4">  {/* the icon with the text  */}
                                <Image
                                    src="email addrase .svg" alt="clock" width={34} height={34} style={{ width: "auto", height: "auto" }} />
                                <div className="font-bold text-[24px] leading-[33.6px] tracking-[-0.5px] text-[#FFFF]"
                                    style={{ fontFamily: "var(--font-dm-sans)" }}>  {/* the 2 lines of text   */}
                                    <p className="">Email Address:</p>
                                    <p className="mt-2 font-normal text-[#FFFF] text-[22.8px] leading-[19.2px] tracking-normal align-middle"
                                        style={{ fontFamily: "var(--font-dm-sans)" }}>
                                        Techyshop@gmail.com
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col  flex-2 ml-[20%]">
                                <Link className=" text-white underline" href="/contact">Privacy Policy</Link>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ padding: '20px' }}>
            </div>
        </section>
        <Footer />
    </main>
    )
}