"use client";
{/* just copyed the other page  */ }
export default function Page() {
    return (
        <section className="min-h-screen flex items-center justify-center  ">
            <div className=" flex flex-col gap-2 pt-4 bg-[#60A5FA] border-none rounded-xl h-[500] w-[350] items-center ">
                <h1 className="text-xl font-bold"> Regisetr  </h1>
                <h1 className="text-xl font-bold"> Creat a new acount </h1>
                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium ">User Name</label>
                    <input type="text" placeholder="IDK"
                        className="bg-[#ffff]  w-[300] h-[40] border-[#3B82F633] rounded-xl pl-4  text-black placeholder-[#94A3B8] outline-none " />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium ">Email</label>
                    <input type="text" placeholder="Somting@gmail.com"
                        className="bg-[#ffff]  w-[300] h-[40] border-[#3B82F633] rounded-xl pl-4  text-black placeholder-[#94A3B8] outline-none " />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium ">Moblie number</label>
                    <input type="text" placeholder="123456789"
                        className="bg-[#ffff]  w-[300] h-[40] border-[#3B82F633] rounded-xl pl-4  text-black placeholder-[#94A3B8] outline-none " />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium ">Passwored</label>
                    <input type="text" placeholder="IG w dont confirm the Passowerd"
                        className="bg-[#ffff]  w-[300] h-[40] border-[#3B82F633] rounded-xl pl-4  text-black placeholder-[#94A3B8] outline-none " />
                </div>

                <div className="pt-8" >
                    <button
                        className="bg-[#1870db]  flex items-center justify-center w-[300] h-[40] hover:brightness-125 border-[#3B82F633] rounded-xl  text-white outline-none " >
                        Login </button>
                </div>
                <div className="flex flex-row self-start px-6 ">
                    <a href="/Authentification" className="text-sm">you have an acount ?</a>
                </div>
            </div>
        </section>
    )
}