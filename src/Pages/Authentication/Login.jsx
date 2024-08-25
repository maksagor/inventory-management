import React, { useEffect } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init'
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import './LoginRegister.css'
import Loading from '../Shared/Loading';

const Login = () => {
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(auth);

    const [token] = useToken(user || gUser);

    let signInError;
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (token) {
            navigate(from, { replace: true });
        }
    }, [token, from, navigate])
    if (user || gUser) {
        navigate(from, { replace: true })
    }

    if (loading || gLoading) {
        return <Loading></Loading>
    }

    if (error || gError) {
        signInError = <p className='text-red-500'><small>{error?.message || gError?.message}</small></p>
    }

    const onSubmit = data => {
        signInWithEmailAndPassword(data.email, data.password);
    }

    return (
        <div className='d-flex justify-content-center align-items-center background-image'>
            <div className="hero min-h-screen left-side">
                <div className="hero-content ">
                    <div>
                        <h2 className="text-white font-bold">Inventory Management</h2>
                        <h4 className="my-3 text-success">Log in to your account</h4>
                        <p className="text-warning mt-5">Don't have an account?</p>
                        <Link to='/register' className="btn btn-outline-success">Register now</Link>
                    </div>
                </div>
            </div>
            <div className="right-side  w-50">
                <div className="card bg-transparent">
                    <div className="card-body">
                        <h2 className='text-primary mb-2'>Log In</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="input-container form-control input-group input-group-sm bg-transparent border-none justify-content-center align-items-center">
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    style={{ width: '70%', padding: '5px', border: 'none' }} 
                                    className="input-group mb-3 text-center fw-bold"
                                    {...register("email", {
                                        required: {
                                            value: true,
                                            message: 'Email is Required'
                                        },
                                        pattern: {
                                            value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                            message: 'Provide a valid Email'
                                        }
                                    })}
                                />
                                <label className="label bg-transparent">
                                    {errors.email?.type === 'required' && <span className="label-text-alt text-danger">{errors.email.message}</span>}
                                    {errors.email?.type === 'pattern' && <span className="label-text-alt text-warning">{errors.email.message}</span>}
                                </label>
                            </div>
                            <div className="input-container form-control input-group input-group-sm mb-3 bg-transparent border-none justify-content-center align-items-center">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    style={{ width: '70%', padding: '5px', border: 'none' }} 
                                    className="input-group mb-3 text-center fw-bold"
                                    {...register("password", {
                                        required: {
                                            value: true,
                                            message: 'Password is Required'
                                        },
                                        minLength: {
                                            value: 6,
                                            message: 'Must be 6 characters or longer'
                                        }
                                    })}
                                />
                                <label className="label">
                                    {errors.password?.type === 'required' && <span className="label-text-alt text-danger">{errors.password.message}</span>}
                                    {errors.password?.type === 'minLength' && <span className="label-text-alt text-warning">{errors.password.message}</span>}
                                </label>
                            </div>
                            {signInError}
                            <input className='btn btn-outline-success w-50 mb-2 fw-bold' type="submit" value="Login" />                            <input className='btn btn-outline-success w-50 mr-0 max-w-xs' type="submit" value="Forget Password" />
                        </form>
                        <div className="divider">OR</div>
                        <button
                            onClick={() => signInWithGoogle()}
                            className="btn btn-outline-success"
                        >Continue with Google</button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Login;