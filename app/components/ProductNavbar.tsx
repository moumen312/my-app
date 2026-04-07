"use client";
import Image from 'next/image'
import Link from 'next/link'
interface NavbarProps {
    search?: string;
    setSearch?: (value: string) => void;
}
export default function ProductNavbar({ search = "", setSearch }: NavbarProps) {
    return (

        <nav className='w-full h-[74]'>

            <div className='flex felx-row ml-auto'>
                <div className='pl-6 pt-4'>
                    <Link href='/'>
                        <Image src="/logo.svg" alt="logo" width={136} height={39} />
                    </Link>
                </div>
                <div className='flex flex-1 justify-end  pr-6 pt-4 '>
                    <div className='flex flex-row  bg-white rounded-2xl px-3 gap-2'>
                        <Image src="/serche icon.svg" alt="search" width={16} height={16} />
                        {/* the serche funtion used */ }
                        <input type="text" placeholder="Search dam or sensor ID..." value={search} onChange={(e) => { setSearch?.(e.target.value);
                        }}
                            className="bg-[#ffff] rounded-2xl w-[367] border-[#3B82F633] pl-4  text-black placeholder-[#94A3B8] outline-none " />
                    </div>
                </div>
            </div>

        </nav>
    );
}