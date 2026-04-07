"use client";
import { useState } from "react"
import { supabase } from "@/app/lib/supabase"
import { useRouter } from "next/navigation"
{/* loge in page tryed to make it work does not im fix it another time  */ }
export default function Page() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) alert(error.message)
        else router.push("/Product")
    }

    return (
        <section className="min-h-screen flex items-center justify-center  ">
            <div className=" flex flex-col gap-6 pt-4 bg-[#60A5FA] border-none rounded-xl h-[500] w-[350] items-center ">
                <h1 className="text-xl font-bold"> Welcome </h1>
                <h1 className="text-xl font-bold"> login into your acount </h1>
                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium ">Email</label>
                    <input type="text" placeholder="Somthing@gmail.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                        className="bg-[#ffff]  w-[300] h-[40] border-[#3B82F633] rounded-xl pl-4  text-black placeholder-[#94A3B8] outline-none " />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-white text-sm font-medium ">Passwored</label>
                    <input type="text" placeholder="Passowerd" value={password}
                    onChange={(e) => setPassword(e.target.value)}
                        className="bg-[#ffff]  w-[300] h-[40] border-[#3B82F633] rounded-xl pl-4  text-black placeholder-[#94A3B8] outline-none " />
                </div>
                <div className="pt-8" >
                    <button
                        className="bg-[#1870db]  w-[300] h-[40] hover:brightness-125 border-[#3B82F633] rounded-xl  text-white outline-none " >
                        Login </button>
                </div>
                <div className="flex flex-row self-start px-6 ">
                    <a href="/Authentification/Register" className="text-sm">dont have an acount ?</a>
                    
                 
                </div>
            </div>
        </section>
    )
}