import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { Label } from './ui/label'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import HOST from '@/utils/HOST'

const Login = () => {
    const [input,setInput] = useState({
        email:"",
        password:""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const LoginHandler = async  (e) => {
        e.preventDefault();
        try{
            setLoading(true);
            const res = await axios.post(`${HOST}/api/v1/user/login`,input,{
                headers:{
                    'Content-type':'application/json'
                },
                withCredentials:true
            });
            if(res.data.message){
                dispatch(setAuthUser(res.data.user))
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email:"",
                    password:""
                });
            }
        }
        catch(error){
            console.log(error);
            toast.error(error.response.data.message);
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        if(user){
            navigate('/');
        }
    },[])

    return (
        <div className='flex items-center w-screen h-screen justify-center'>
        <form onSubmit ={LoginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
            <div className='my-4'>
            <div className='w-full flex justify-center items-center'>
                <img src='../../Connectify.svg' className='w-[5rem]'/>
            </div>
            <p className='italic font-extralight text-sm text-center'>
                Login to see photos & videos from your friends
            </p>
            </div>
            <div>
                <Label className='font-medium'>Email</Label>
                <Input
                    type="email"
                    name="email"
                    value = {input.email}
                    onChange = {changeEventHandler}
                    className="focus-visible:ring-transparent my-2"
                />
            </div>
            <div>
                <Label className='font-medium'>Password</Label>
                <Input
                    type="password"
                    name="password"
                    value = {input.password}
                    onChange = {changeEventHandler}
                    className="focus-visible:ring-transparent my-2"
                />
            </div>
            {
                loading ? (
                    <Button >
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Please wait
                    </Button>
                ):(
                    <Button type="submit" >Login</Button>
                )
            }
            <span className='text-center'>Doesn't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
        </form>
        </div>
    )
}

export default Login;
