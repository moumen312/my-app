import Image from 'next/image'
import Link from "next/link";
export default function Footer() {
  return (
   
    <footer className="bg-[#00112580] text-white py-6 px-4 text-center">
         <div className="flex flex-row"> 
            <div className='ml-[110] flex flex-col'>
            <Image
                src="/logo.svg"
                width={210}
                height={60}
                alt="Picture of the author" 
                className="ml-[26] mt-[18] mb-[18]"
                priority  />
                <p  className="w-[184] ml-[26] font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal align-middle"
  style={{ fontFamily: "var(--font-dm-sans)" }}>Your trusted platform for smart tech shopping.</p>
            <div className='flex flex-row '>
                <Link href='#'>
            <Image src="/facbook logo.svg"
                width={36}
                height={34}
                alt="Picture of the author" 
                className="ml-[40] mt-[18] mb-[18]" />
                </Link>
                <Link href='#'>
                 <Image src="/Linkdinicon.svg"
                width={36}
                height={34}
                alt="Picture of the author" 
                className="ml-[26] mt-[18] mb-[18]" />
                </Link>
                <Link href='#'>
                 <Image src="/emailicon.svg"
                width={36}
                height={34}
                alt="Picture of the author" 
                className="ml-[26] mt-[18] mb-[18]" />
                </Link>
            </div>
         </div>
          <div className='flex flex-col mt-[32] ml-[300] w-[184] gap-3 items-start'>
                <h1>Services</h1>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Product Browsing</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Smart Recommendations</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Secure Payment</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Fast Delivery</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >AI Assistance</Link>
            </div>
            <div className='flex flex-col mt-[32] ml-[200] w-[184] gap-3 items-start'>
                <h1>Company</h1>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >About Us</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Product</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Contact</Link>
                <Link href='#' className="font-normal text-[14px] text-[#475569] leading-[22.4px] tracking-normal"
                >Support</Link>
            </div>
     </div>
      <div style={{padding:'30px'}}>
          </div>
          
      <div className="flex  ml-[5%]  border-b-2 w-[90%] 
       "style={{borderColor: "#424242" }}>
       </div>

      <p className="mt-[30] text-sm">&copy; {new Date().getFullYear()} T.E.C.H.Y. All rights reserved.</p>
    </footer>
    
  );
}