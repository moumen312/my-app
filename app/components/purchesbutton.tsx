"use client";
{/* made it separtly cuz u cant intercet with the id page cuz of the async function */ }
export default function Purchesbutton(){
    return(

        <button onClick={() => console.log('it work')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" >
            Buy Now
        </button>
        
    )

}