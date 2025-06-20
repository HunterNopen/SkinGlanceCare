import React, { use } from 'react'
import {motion} from 'framer-motion'
import Input from '../components/Input'
import { User } from 'lucide-react'
import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import {Link, useNavigate} from 'react-router-dom'
import PasswordStrengthMeter from '../../../../mern-advanced-auth/mern-advanced-auth/frontend/src/components/PasswordStrengthMeter'
import { useAuthStore } from '../store/authStore'
import { Loader } from 'lucide-react'
const SignUpPage = () => {
 
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    const {signup,error,isLoading} = useAuthStore()
    const handleSubmit = async (e)=> {
        e.preventDefault()

        try{
            await signup(password,name);
            navigate("/Login");
        }catch(error){
            console.log(error)
        }
    }
 
    return (
    <motion.div initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>

    <div className="p-8">
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>Create account</h2>
        <form onSubmit={handleSubmit}>
        <Input 
        icon={User}
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        />
               <Input 
        icon={Mail}
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
                      <Input 
        icon={Lock}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        />
        {/* Password strength checker */}
        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
        <PasswordStrengthMeter password={password} />

        <motion.button className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-green-600
						hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
                        disabled={isLoading}>
                        
            {isLoading ? <Loader className='animate-spin mx-auto' size={20} /> : "Sign Up"}
            
        </motion.button>
        </form>
        </div> 
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className='text-sm text-gray-400'>
                Already have an account?{" "}
                <Link to={"/login"} className='text-green-400 hover:underline'>Sign In</Link>
            </p>
        </div>

    </motion.div>
  )
}

export default SignUpPage
