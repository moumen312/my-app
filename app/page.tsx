"use client";
import Link from "next/link";
import Navbar from "./components/Navbar";
import { Instrument_Serif } from "next/font/google";
import Image from "next/image";
import StepsSection from "./components/StepsSection";
import Footer from "./components/Footer";




const features = [
  "Less than 48 hours",
  "Secure",
  "Smart",
  "Organized",
];

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const items = [
  { image: "/phone.svg", text: "phone", link: "/product" },
  { image: "/Laptops.svg", text: "Laptops", link: "/product" },
  { image: "/Wires.svg", text: "Wires", link: "/product" },
  { image: "/Accessories.svg", text: "Accessories", link: "/product" },
  { image: "/Camera.svg", text: "Camera", link: "/product" },
  { image: "/Bags.svg", text: "Bags", link: "/product" },
];
const items2 = [
  { src: "/best seller.svg", link: "/product" },
  { src: "/trendeing.svg", link: "/product" },
  { src: "/top rated.svg", link: "/product" },
  { src: "/best value.svg", link: "/product" },
  { src: "/poupulr.svg", link: "/product  " },
];
const topRow = items2.slice(0, 3)
const bottomRow = items2.slice(3, 5)


export default function Home() {
  return (
    <main style={{ background: "var(--bg)" }}>

      <section className=" min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <Navbar />

        {/* Two column layout */}
        <div className="flex flex-row px-16">

          {/* ── LEFT COLUMN ── */}
          <div className="flex ml-12 flex-col flex-1">

            {/* Oval badge */}
            <div className="flex  bg-[#0F172A] rounded-full px-8 py-2 w-fit mt-[4vh] ml-[10%] mb-[2%]">
              <span className="text-[#60A5FA] text-[13px] font-medium">
                Rated as one of the best shop websites!
              </span>
            </div>

            {/* Hero text */}
            <div className="flex flex-col  px-6 md:px-0">
              <h1 className={`${instrumentSerif.className} text-white ml-[10%] text-[60px] md:text-[60.8px] font-normal leading-tight md:leading-[65.66px]`}>
                Shop now in Techy
              </h1>
              <h1 className={`${instrumentSerif.className} w-[645px] ml-[9.5%] text-[60px] md:text-[60.8px] font-normal italic leading-tight md:leading-[65.66px]`}>
                <span style={{
                  background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  padding: "0 4px",
                  display: "inline-block",
                }}>
                  Pick, Order, Ready in less than 48 Hours.
                </span>
              </h1>
              <p className="mt-[2%] ml-[10%] font-normal text-[17px] leading-[29.75px] text-[#94A3B8]"
                style={{ fontFamily: "var(--font-dm-sans)" }}>
                Here in Techy you can order what you want with good prices.
              </p>
            </div>

            {/*  grid */}
            <div className="mt-[3%] ml-[10%] grid grid-cols-3 w-fit gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-4 text-[#94A3B8] text-sm"
                  style={{ fontFamily: "var(--font-dm-sans)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-row mt-6 items-center gap-4 px-6 md:px-0 md:ml-[10%]">
              <a href="/Authentification" className="flex items-center justify-center w-[247px] h-[53px] border bg-white border-white hover:brightness-125 text-[#001125]"
                style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 600, fontSize: "15px", borderRadius: "8px" }}>
                Create your account now
                <div>
                  
                </div>
              </a>
              <Link href="#section2" >
                <button className="w-[247px] h-[53px] border-none bg-transparent outline-none hover:brightness-125"
                  style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: "14px", color: "#60A5FA" }}>
                  <span className="inline-flex items-center gap-2">
                    check categories
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="1" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex items-center justify-center pr-[5%] pt-[4%]">
            <div className="relative w-100 rounded-[20px]"
              style={{
                height: "420.36px",
                border: "1px solid #3B82F633",
                backgroundColor: "#0F172AB2",
              }}>

              {/* text/icons inside here */}
              <div className="absolute inset-0 flex flex-col items-left mt- gap-4 p-6">
                <span className="text-[#3B82F6] font-xl text-[11.2px] leading-[17.92px] tracking-[1.12px] align-middle uppercase "
                  style={{ fontFamily: "var(--font-dm-sans)" }}>What you get with OpenSlate</span>
              </div>
              <div className=" flex flex-col gap-10">    {/* start of the overlay content */}
                <div className="absolute flex flex-row top-[70] left-[20] gap-4">  {/* the icon with the text  */}
                  <Image
                    src="/playbutton.svg" alt="clock" width={34} height={34} style={{ width: "auto", height: "auto" }}
                  />
                  <div className="font-medium text-[14.4px] leading-[23.04px] tracking-normal align-middle"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>  {/* the 2 lines of text   */}
                    <p className="text-white">Fast shopping</p>
                    <p className="font-normal text-[#475569] text-[12.8px] leading-[19.2px] tracking-normal align-middle"
                      style={{ fontFamily: "var(--font-dm-sans)" }}>
                      Find and buy products quickly and easily.
                    </p>
                  </div>


                </div>
                <div className="absolute flex flex-row top-[140] left-[20] gap-4">  {/* the icon with the text  */}
                  <Image
                    src="/clook.svg" alt="clock" width={34} height={34} />
                  <div className="font-medium text-[14.4px] leading-[23.04px] tracking-normal align-middle"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>  {/* the 2 lines of text   */}
                    <p className="text-white">Smart recommendations</p>
                    <p className="font-normal text-[#475569] text-[12.8px] leading-[19.2px] tracking-normal align-middle"
                      style={{ fontFamily: "var(--font-dm-sans)" }}>
                      Get suggestions tailored to your needs.
                    </p>
                  </div>


                </div>
                <div className="absolute flex flex-row top-[210] left-[20] gap-4">  {/* the icon with the text  */}
                  <Image
                    src="/securty.svg" alt="clock" width={34} height={34} />
                  <div className="font-medium text-[14.4px] leading-[23.04px] tracking-normal align-middle"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>  {/* the 2 lines of text   */}
                    <p className="text-white  ">Secure payment</p>
                    <p className="font-normal text-[#475569] text-[12.8px] leading-[19.2px] tracking-normal align-middle"
                      style={{ fontFamily: "var(--font-dm-sans)" }}>

                      Safe and protected payment methods.
                    </p>
                  </div>


                </div>
                <div className="absolute flex flex-row top-[280] left-[20] gap-4">  {/* the icon with the text  */}
                  <Image
                    src="/assistance.svg" alt="clock" width={34} height={34} />
                  <div className="font-medium text-[14.4px] leading-[23.04px] tracking-normal align-middle"
                    style={{ fontFamily: "var(--font-dm-sans)" }}>  {/* the 2 lines of text   */}
                    <p className="text-white">AI assistant</p>
                    <p className="font-normal text-[#475569] text-[12.8px] leading-[19.2px] tracking-normal align-middle"
                      style={{ fontFamily: "var(--font-dm-sans)" }}>
                      Get instant help anytime.
                    </p>
                  </div>


                </div>

              </div>

            </div>
          </div>

        </div>
      </section>
      {/* ─── Section 2 ─── */}
      <section className="relative min-h-screen bg-[#0F172A]" id="section2">

        {/* Categories label */}
        <p
          className="absolute top-[45] ml-[7.5%] -translate-x-1/2  md:translate-x-0 uppercase text-[#3B82F6] text-[12px] tracking-[1.2px] leading-[19.2px]"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
        >
          Categories
        </p>

        {/* Section headers */}
        <div className="flex flex-col ">
          <h1
            className={`${instrumentSerif.className} text-white mt-[100] ml-[15%]  md:text-left md:ml-[225] text-[50px] md:text-[60.8px] font-normal leading-tight md:leading-[65.66px]`}
          >
            Whatever in you mind
          </h1>

          <h1
            className={`${instrumentSerif.className} ml-[14.5%]  md:text-left md:ml-[220] text-[50px] md:text-[60.8px] font-normal italic leading-tight md:leading-[65.66px]`}
          >
            <span
              style={{
                background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                padding: "0 6px",
                display: "inline-block",
              }}
            >
              You can find it here!
            </span>
          </h1>

          <p
            className="mt-5  ml-[15%] md:text-left md:ml-[225] text-[17px] leading-[29.75px] text-[#94A3B8]"
            style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
          >
            do you want to buy from specific category you can search it and pick from it easily.
          </p>
        </div>

        {/* Items grid */}
        <div className="mt-[20] grid grid-cols-3 w-fit mx-auto gap-x-[64]  gap-10 ">
          {items.map((item) => (
            <Link key={item.text} href={item.link} className="no-underline w-fit">
              <div className="flex flex-col gap-1 cursor-pointer w-fit">
                <Image
                  src={item.image}
                  alt={item.text}
                  width={0}
                  height={0}
                  className="rounded-lg object-cover w-[200] h-[200]"
                />
                <p
                  className="text-[14px] text-[#94A3B8] m-0 text-center mt-[4]"
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    color: "#FFFFFF",
                    fontWeight: 500,
                    fontSize: "25px",
                    lineHeight: "24px",
                    letterSpacing: "0%",
                    verticalAlign: "middle"
                  }}
                >
                  {item.text}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {/* See more button */}
        <div className="flex ml-[70%] md:justify-end md:mr-[225] mt-10">
          <button
            className="w-[247] h-[53] rounded-lg border-none bg-transparent outline-none hover:brightness-125"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: "24px",
            }}
          >
            <span className="inline-flex items-center gap-3">
              <span
                style={{
                  background: "linear-gradient(90deg, #94A3B8, #424952)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "inline-block",
                }}
              >
                See more
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                className="relative top-[2]"
              >
                <defs>
                  <linearGradient id="seeMoreArrow" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#94A3B8" />
                    <stop offset="100%" stopColor="#424952" />
                  </linearGradient>
                </defs>
                <line x1="1" y1="12" x2="19" y2="12" stroke="url(#seeMoreArrow)" />
                <polyline points="12 5 19 12 12 19" stroke="url(#seeMoreArrow)" />
              </svg>
            </span>
          </button>
        </div >
        <div style={{ padding: '20px' }}>

        </div>

      </section>
      {/* ─── Section 3 ─── */}
      <section className="relative min-h-screen bg-[#090D18]">
        <p
          className="absolute top-[10] ml-[14.5%] -translate-x-1/2 ]  uppercase text-[#3B82F6] text-[12px] tracking-[1.2px] leading-[19.2px]"
          style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 400 }}
        >
          How It Works
        </p>
        <div className="mt-[1%] flex  ml-[24%]  flex-row items-ceter  gap-4 md:gap-0  px-6 md:px-0 ">
          <h1
            className={`${instrumentSerif.className} mt-[32px]  ml-[15%] text-center md:ml-[-125px] text-[40px] md:text-[60.8px] font-normal tracking-normal leading-tight md:leading-[65.66px] align-middle`}
          ><span style={{ fontFamily: "var(--font-dm-sans)", color: "#FFFFFF" }}>
              Simple steps for
            </span>
            <span
              style={{
                fontFamily: "var(--font-dm-sans)",
                background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginLeft: "8px",
              }}
            >
              Customers & Sellers
            </span>
            <span style={{ fontFamily: "var(--font-dm-sans)", color: "#FFFFFF", marginLeft: "8px" }}>
              in 3 Steps
            </span>
          </h1>

        </div>
        <p className="mt-[5%] text-center  md:ml-[125] font-normal text-[17px] leading-[29.75px] text-[#94A3B8]"
          style={{ fontFamily: "var(--font-dm-sans)" }}>
          No hassle. No delays. Just a smooth and efficient buying and selling process.
        </p>
        <div className="flex flex-col  flex-rowx-0 "> <p
          className="absolute top-[250] ml-[0%] -translate-x-1/2 md:left-[225] md:translate-x-0 uppercase text-[#3B82F6] text-[12px] tracking-[1.2px] leading-[19.2px]"
          style={{
            fontFamily: "var(--font-dm-sans)", fontWeight: 500,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0%",
            verticalAlign: "middle"
          }}
        >
          For Customers
        </p> <p
          className="absolute top-[250] ml-[46%] -translate-x-1/2 md:left-[225] md:translate-x-0 uppercase text-[#3B82F6] text-[12px] tracking-[1.2px] leading-[19.2px]"
          style={{
            fontFamily: "var(--font-dm-sans)", fontWeight: 500,
            fontSize: "16px",
            lineHeight: "24px",
            letterSpacing: "0%",
            verticalAlign: "middle"
          }}
        >
            For Sellers
          </p>
          <StepsSection /> {/*  the tabel description */}
        </div>
        <div style={{ padding: '40px' }}>

        </div>
      </section>
      <section className="relative min-h-screen bg-[#0F172A]">
        <div className="flex flex-col">
          <div className="flex flex-col gap-6">
            <h1
              className={`${instrumentSerif.className} mt-12 text-white text-center text-[60.8px]  font-normal leading-tight md:leading-[65.66px]`}
            >
              Most Popular Products

            </h1> 

            <h1
              className={`${instrumentSerif.className}  text-center   text-[50px] md:text-[60.8px] font-normal italic leading-tight md:leading-[65.66px]`}
            >
              <span
                style={{
                  background: "linear-gradient(90deg, #60A5FA, #A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  padding: "0 6px",
                  display: "inline-block",
                }}
              >
                Top trending items based on user activity
              </span>
            </h1>
          </div>
          <div className="w-full flex flex-col items-center gap-4 mt-[64]">

            {/* Row 1 - 3 boxes */}
            <div className="flex gap-24">
              {topRow.map((item, index) => (
                <Link href={item.link} key={index}>
                  <div className="bg-[#0F172A] rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity w-[200px] h-[200px]">
                    <Image src={item.src} alt={item.src} width={200} height={200} className="w-full h-full object-cover" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 - 2 boxes centered under the gaps */}
            <div className="flex gap-24 mt-6">
              {bottomRow.map((item, index) => (
                <Link href={item.link} key={index}>
                  <div className="bg-[#0F172A] rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity w-[200px] h-[200px]">
                    <Image src={item.src} alt={item.src} width={200} height={200} className="w-full h-full object-cover" />
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
        <div className="h-[64]"></div>
      </section>
 
      <Footer />
    </main>
  );
}

