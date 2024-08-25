import React from 'react';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle, useUpdateProfile } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import Loading from '../Shared/Loading';

const Register = () => {
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const { register, formState: { errors }, handleSubmit } = useForm();
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(auth);

    const [updateProfile, updating, updateError] = useUpdateProfile(auth);

    const [token] = useToken(user || gUser);

    const navigate = useNavigate();

    let signInError;

    if (loading || gLoading || updating) {
        return <Loading></Loading>
    }

    if (error || gError || updateError) {
        signInError = <p className='text-red-500'><small>{error?.message || gError?.message || updateError?.message}</small></p>
    }

    if (token) {
        navigate('/');
    }

    const onSubmit = async data => {
        await createUserWithEmailAndPassword(data.email, data.password);
        await updateProfile({ displayName: data.name });
        console.log('update done');
    }
    return (
        <>
            <div className='background-image'>
                <div className="d-flex justify-content-center align-items-center">
                    <div className="d-flex justify-content-center align-items-center card mt-20 bg-transparent text-body">
                        <h1 className='text-primary my-3'>Register Here</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="card-body bg-transparent text-body w-full">
                                <div class="row mb-4">

                                    <div class="col">
                                        <input type="text"
                                            style={{ width: '100%', padding: '5px', border: 'none' }}
                                            class="form-control"
                                            placeholder="Name" aria-label="First name"
                                            {...register("name", {
                                                required: {
                                                    value: true,
                                                    message: 'Name is Required'
                                                }
                                            })} />
                                        <label className="label">
                                            {errors.name?.type === 'required' && <span className="label-text-alt text-danger">{errors.name.message}</span>}
                                        </label>
                                    </div>

                                    <div class="col">
                                        <input type="number"
                                            style={{ width: '100%', padding: '5px', border: 'none' }}
                                            class="form-control"
                                            placeholder="Phone No" aria-label="Phone No"
                                            {...register("phone", {
                                                required: {
                                                    value: true,
                                                    message: 'Phone number is Required'
                                                },
                                                pattern: {
                                                    value: `^\+?8801[1-9]\d{8}$`,
                                                    message: 'Provide a valid Phone number'
                                                }
                                            })}
                                        />
                                        <label className="label">
                                            {errors.phone?.type === 'required' && <span className="label-text-alt text-danger">{errors.phone.message}</span>}
                                            {errors.phone?.type === 'pattern' && <span className="label-text-alt text-warning">{errors.phone.message}</span>}
                                        </label>
                                    </div>

                                </div>
                                <div class="row mb-4">

                                    <div class="col">
                                        <input type="email"
                                            style={{ width: '100%', padding: '5px', border: 'none' }}
                                            class="form-control"
                                            placeholder="Email" aria-label="First name"
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
                                        <label className="label">
                                            {errors.email?.type === 'required' && <span className="label-text-alt text-danger">{errors.email.message}</span>}
                                            {errors.email?.type === 'pattern' && <span className="label-text-alt text-warning">{errors.email.message}</span>}
                                        </label>
                                    </div>
                                    <div class="col">
                                        <input type="password"
                                            style={{ width: '100%', padding: '5px', border: 'none' }}
                                            class="form-control"
                                            placeholder="Password" aria-label="Password"
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

                                </div>
                                <div class="row mb-2">

                                <div class="col">
                                        <input type="text"
                                            style={{ width: '100%', padding: '5px', border: 'none' }}
                                            class="form-control"
                                            placeholder="Company Name" aria-label="Company Name"
                                            {...register("companyName", {
                                                required: {
                                                    value: true,
                                                    message: 'Company name is Required'
                                                }
                                            })} />
                                        <label className="label">
                                            {errors.companyName?.type === 'required' && <span className="label-text-alt text-danger">{errors.companyName.message}</span>}
                                        </label>
                                    </div>
                                    <div class="col">
                                        <input type="text"
                                            style={{ width: '100%', padding: '5px', border: 'none' }}
                                            class="form-control"
                                            placeholder="Address" aria-label="Address"
                                            {...register("address", {
                                                required: {
                                                    value: true,
                                                    message: 'Address is Required'
                                                }
                                            })} />
                                        <label className="label">
                                            {errors.address?.type === 'required' && <span className="label-text-alt text-danger">{errors.address.message}</span>}
                                        </label>
                                    </div>                                   

                                </div>
                            </div>

                            {signInError}
                            <input className='btn btn-outline-success' type="submit" value="Sign Up" />
                        </form>
                        <div className='mt-3 text-warning'>
                        <p><small className='text-warning'>Already have an account? <Link className='btn btn-outline-success w-50 mb-2 fw-bold' to="/login">Please login</Link></small></p>
                    <div className='d-flex justify-content-center align-items-center'><p>----------------  </p> OR <p>  -----------------</p></div>
                    <button
                        onClick={() => signInWithGoogle()}
                        className="btn btn-outline-success"
                    >Continue with Google</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;