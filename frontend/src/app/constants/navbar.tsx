import { Orbitron } from "next/font/google";
import { Lexend } from "next/font/google";
import Link from "next/link";

const orbitron = Orbitron({
    subsets:["latin"],
    weight:['400','700']
})

const lexend = Lexend({
    subsets:['latin'],
    weight:['400','500','700'] 
}) 

const loggedIn = localStorage.getItem("authToken") !== null;
const Navbar =() =>{
    return(
        <main style={{position:'absolute', 
                        top:'0', 
                        left:'0', 
                        width:'100%', 
                        height:'10%', 
                        backgroundColor:'transparent', 
                        border:'1px solid #ade8f4', 
                        display:'flex', 
                        alignItems:'center', 
                        justifyContent:'center', 
                        flexDirection:'column', 
                        textAlign:'center'}}>
            <div className="nav-items" style={{display:'flex', flexDirection:'row', gap:'20rem', color:'#fff'}}>
                <ul style={{listStyleType:'none', 
                                padding:0, 
                                margin:0, 
                                display:'flex', 
                                flexDirection:'row', 
                                gap:0}}>
                    <li className={orbitron.className}>AI</li>
                    <li className={orbitron.className}>QA</li>
                    <li className={orbitron.className}>HUB</li>
                </ul>

                <ul style={{listStyleType:'none', 
                                padding:0, 
                                margin:0, 
                                display:'flex', 
                                flexDirection:'row', 
                                gap:'20px'}}>
                    <span className={lexend.className}>Welcome</span>
                    <li className={lexend.className} > Help and Support</li>
                </ul>

                <ul style={{listStyleType:'none', 
                                padding:0, 
                                margin:0, 
                                display:'flex', 
                                flexDirection:'row', 
                                gap:'20px'}}>
                    {/*if user islogged in then show logout else show login and signup*/}
                    {loggedIn ? (
                        <li 
                            className={orbitron.className} 
                            onClick={() => {
                            localStorage.removeItem("authToken");
                            window.location.reload();
                            }}
                        >
                            Logout
                        </li>
                        ) : (
                        <>
                            <li className={orbitron.className}>
                            <Link href="/login">Login</Link>
                            </li>
                            <li className={orbitron.className}>
                            <Link href="/signup">SignUp</Link>
                            </li>
                        </>
                        )}
                </ul>
            </div>

        </main>

    )
}

export default Navbar;