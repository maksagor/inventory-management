import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import auth from '../../firebase.init';

const AddProduct = () => {
    const [user] = useAuthState(auth);

    const { register, formState: { errors }, handleSubmit, reset } = useForm();

    const imageStorageKey = '26ba184b8e6ebeef9c920cfc52612aeb';

    const onSubmit = async data => {
        const image = data.image[0];
        const formData = new FormData();
        formData.append('image', image);
        const url = `https://api.imgbb.com/1/upload?key=${imageStorageKey}`;
        fetch(url, {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    const img = result.data.url;
                    const product = {
                        name: data.name,
                        description: data.description,
                        price: data.price,
                        availableQuantity: data.availableQuantity,
                        minimumOrderQuantity: data.minimumOrderQuantity,
                        img: img
                    }

                    fetch('https://intense-brook-66546.herokuapp.com/product', {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(product)
                    })
                        .then(res => res.json())
                        .then(inserted => {
                            console.log(inserted)
                            toast.success('Product added successfully');
                            reset();
                        })

                }

            })
    }
    return (
        <div className='background-image'>
            <div className="d-flex justify-content-center align-items-center">
                <div className="d-flex justify-content-center align-items-center card mt-20 bg-transparent text-body">
                    <h1 className='text-primary my-3'>Add a Products</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-control w-full max-w-xs mb-0">
                            <input
                                type="text"
                                placeholder="Product Name"
                                className="input-group mb-3 text-center fw-bold"
                                {...register("name", {
                                    required: {
                                        value: true,
                                        message: 'Name is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.name?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input
                                type="text"
                                placeholder="Description"
                                className="input-group mb-3 text-center fw-bold"
                                {...register("description", {
                                    required: {
                                        value: true,
                                        message: 'Description is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.description?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input
                                type="number"
                                placeholder="Price"
                                className="input-group mb-3 text-center fw-bold"
                                {...register("price", {
                                    required: {
                                        value: true,
                                        message: 'Price is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.price?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>



                        <div className="form-control w-full max-w-xs">
                            <input
                                type="file"
                                className="input-group mb-3 text-center fw-bold"
                                {...register("image", {
                                    required: {
                                        value: true,
                                        message: 'Image is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.name?.type === 'required' && <span className="label-text-alt text-red-500">{errors.name.message}</span>}
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input
                                type="number"
                                placeholder="Available Quantity"
                                className="input-group mb-3 text-center fw-bold"
                                {...register("availableQuantity", {
                                    required: {
                                        value: true,
                                        message: 'Available Quantity is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.availableQuantity?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input
                                type="number"
                                placeholder="Minimum Order Quantity"
                                className="input-group mb-3 text-center fw-bold"
                                {...register("minimumOrderQuantity", {
                                    required: {
                                        value: true,
                                        message: 'Minimum Order Quantity is Required'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.minimumOrderQuantity?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                            </label>
                        </div>

                        <input className='btn w-full max-w-xs text-white' type="submit" value="Add Product" />
                    </form>
                </div>
                </div>
                </div>
                );
};

                export default AddProduct;