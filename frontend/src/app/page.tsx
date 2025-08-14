"use client";
import { useState } from "react";
import { Orbitron } from "next/font/google";
import { Lexend } from "next/font/google";
import Navbar from "./constants/navbar";
import {useRouter} from "next/router"

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  weight: ["400", "700"] 
});

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '700'] // Choose weights you need
})

const router = useRouter();
const login = () =>{
  router.push('/login');
  }
const register = () =>{
  router.push('/register');
}


export default function Home() {  

  return (
   <main className="w-screen h-screen" 
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGVjaHxlbnwwfHwwfHx8MA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}>
        
        <div className="absolute inset-0 bg-black opacity-70 "></div>

        <Navbar />


        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: '600px',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: 'transparent',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          flexDirection:'column',
          alignContent:'center'
        }}>
          <h1 style={{fontSize:'2.4rem', fontWeight:'bold', alignItems:'center',textShadow: '0 0 10px #415a77,0 0 20px #415a77,0 0 30px #415a77;'}} className={orbitron.className}>TRANSFORM YOUR DATA INTO INSIGHTS</h1>
          <p className={lexend.className}>Unleash the Power of AI with our interactive Q&A</p>
          <span style={{fontSize:'1.2rem', color:'#0096c7',textShadow: '0 0 10px #ade8f4,0 0 20px #ade8f4,0 0 30px #ade8f4;', fontWeight:'bold'}} className={orbitron.className}>Intelligent. Instant. Intuitive.</span>

          <br />
          <div className="buttons" 
            style={{
              display:'flex',
              flexDirection:'row',
              gap:'20px'
            }}>
            <button onClick={login} className="landing-btn">Login</button>
            <button onClick={register} className="landing-btn">SignUp</button>
        </div>
        </div>
        
      </main>
  );
}
 {/*}
    
   
   */}

   

