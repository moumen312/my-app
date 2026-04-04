
import Image from 'next/image'
import Link from 'next/link'
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between w-full" style={{
      backgroundColor: '#00112580',
      border: '1px solid #3B82F61A',
    }}>

      {/* Logo */}
      <Link href='/'> 
      <Image  src="/logo.svg"  width={136} height={48}  alt="logo"  className="ml-[26px] mt-[18px] mb-[18px]"priority />
         </Link>
      {/* right side buttons */}
      <div className="transition-all mr-[40] text-white ">
        <a href="/contact-us" className='hover:brightness-125 text-[14px] font-medium leading-[22.4px] tracking-normal align-middle dmSans.className  text-[var(--authntication)] no-underline mr-[40px]'>Contact us</a>
        <a href="#" className='hover:brightness-125 text-[14px] font-medium leading-[22.4px] tracking-normal align-middle dmSans.className  text-[var(--authntication)] no-underline mr-[40px]'>About us</a>
        <button className='hover:brightness-125 text-[14px] font-medium leading-[22.4px] tracking-normal align-middle dmSans.className bg-transparent border-none text-[var(--authntication)] mr-[40px]'>
          Login
        </button>
        <button className='border-none hover:brightness-125 text-[14px] font-medium leading-[22.4px] tracking-normal align-middle bg-transparent  text-[var(--authntication)] mr-[40px]'>
          Signup
        </button>
      </div>
    </nav>
  );
}