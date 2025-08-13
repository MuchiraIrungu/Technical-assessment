"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../constants/navbar"
//import { Oranienbaum } from "next/font/google";
import { Orbitron } from "next/font/google";
import { Lexend } from "next/font/google";

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: ["400","700"]
});

const lexend = Lexend({
    subsets: ['latin'],
    weight: ['400', '500', '700'] 
})

const Register =() =>{
    const [showPassword, setshowPassword] = useState(false);
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [password1, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e: React.FormEvent)=>{
        e.preventDefault();

        const response = await fetch("http://localhost:8000/auth/register", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                contact,
                password1,
                password2
            })  
        });
        const data = await response.json();
        setMessage(data.message || "Something went wrong, please try again.");

        if (response.status === 200){
            router.push("/login")
            alert("Registration successful! Please login to continue.");
        }
    }
    

    return(
        <main style={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1667698531529-b53952a86194?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGFyayUyMHRlY2h8ZW58MHx8MHx8fDA%3D')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100vh",
            width: "100vw"
        }}>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <Navbar />
            
            <button style={{alignItems:'start', left:'0', marginTop:'80px', display:'flex', flexDirection:'row'}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
                </svg> Back to welcome</button>
            <div className="login-form" style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height:'70%',
                maxWidth: '400px',
                padding: '20px',
                backgroundColor: '#495057',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                border:'1px solid #e4c1f9'
            }}>
                <h1 className={orbitron.className} style={{fontSize:'1.5rem',fontWeight:'bold', display:'flex', flexDirection:'row'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-door-open" viewBox="0 0 16 16">
                        <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
                        <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
                    </svg>
                    Sign in
                </h1>

                <form style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '20px',
                    gap:'5px'
                }} onSubmit={handleRegister}>
                    <label className={lexend.className}>Username </label>
                    <input type="text" placeholder="username" value={username} onChange={e=> setUsername(e.target.value)} />
                    
                    <label className={lexend.className}>Email </label>
                    <input type="text" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
                    <label className={lexend.className} >Contact </label>
                    <input type="text" placeholder="contact" value={contact} onChange={e =>setContact(e.target.value)} />

                    <label className={lexend.className}>Password</label>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            
                            placeholder="**********"
                            style={{
                                backgroundColor: 'var(--foreground)',
                                color: 'var(--background)',
                                border: '1px solid #ade8f4',
                                padding: '0.5rem',
                                borderRadius: '0.55rem',
                                width: '100%',
                                height: '2.5rem',
                                boxSizing: 'border-box',
                                paddingRight: '2rem', // space for icon
                            }}
                            value={password1}
                            onChange={e=> setPassword(e.target.value)}
                        />
                        <div className="icons" onClick={() => setshowPassword(!showPassword)} style={{display:'flex', flexDirection:'row'}}>
                            
                        {showPassword ? (
                            (
                                // if show password is true late night
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: 'var(--background)',
                                    }}
                                >
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                </svg>
                            )
                        ) : (
                            (
                                // if show password is false
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16" style={{position: 'absolute',
                                                                                                                                                                            right: '8px',
                                                                                                                                                                            top: '50%',
                                                                                                                                                                            transform: 'translateY(-50%)',
                                                                                                                                                                            cursor: 'pointer',
                                                                                                                                                                            color: 'var(--background)',
                                    }}>
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                </svg>
                            )
                        )}
                        </div>
                    </div>

                    <label className={lexend.className}>Confirm Password</label>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'row',
                    }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            
                            placeholder="**********"
                            style={{
                                backgroundColor: 'var(--foreground)',
                                color: 'var(--background)',
                                border: '1px solid #ade8f4',
                                padding: '0.5rem',
                                borderRadius: '0.55rem',
                                width: '100%',
                                height: '2.5rem',
                                boxSizing: 'border-box',
                                paddingRight: '2rem', // space for icon
                            }}
                            value={password2}
                            onChange={e=> setPassword2(e.target.value)}
                        />
                        <div className="icons" onClick={() => setshowPassword(!showPassword)} style={{display:'flex', flexDirection:'row'}}>
                            
                        {showPassword ? (
                            (
                                // if show password is true late night
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    viewBox="0 0 16 16"
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: 'var(--background)',
                                    }}
                                >
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                                </svg>
                            )
                        ) : (
                            (
                                // if show password is false
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16" style={{position: 'absolute',
                                                                                                                                                                            right: '8px',
                                                                                                                                                                            top: '50%',
                                                                                                                                                                            transform: 'translateY(-50%)',
                                                                                                                                                                            cursor: 'pointer',
                                                                                                                                                                            color: 'var(--background)',
                                    }}>
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                                </svg>
                            )
                        )}
                        </div>
                    </div>


                    <button type="submit" className="login-btn" style={{
                        marginTop: '20px',
                        padding: '10px',
                        backgroundColor: '#e4c1f9',
                        color: '#495057',
                        borderRadius: '5px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}>Register</button>
                </form>

            </div>
        </main>
    )
}

export default Register;