import { Helmet } from "react-helmet-async";
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Collapse } from "bootstrap";
import './Invoice.css'

import image1 from '../../assets/1.jpg';
import image2 from '../../assets/2.jpg';
import image3 from '../../assets/3.jpg';
import image4 from '../../assets/1.jpg';
import image5 from '../../assets/2.jpg';
import image6 from '../../assets/3.jpg';
import image7 from '../../assets/1.jpg';
import image8 from '../../assets/2.jpg';
import image9 from '../../assets/3.jpg';
import image10 from '../../assets/1.jpg';
import { Link } from "react-router-dom";

// const getInitialProducts = () => {
//     const savedProducts = localStorage.getItem('products');
//     return savedProducts ? JSON.parse(savedProducts) : [
//         { id: 1, image: image1, name: 'Potato Chips', unitPrice: 10, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 2, image: image2, name: 'Corn Chips', unitPrice: 20, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 3, image: image3, name: 'Pita Chips', unitPrice: 30, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 4, image: image4, name: 'Vegetable Chips', unitPrice: 40, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 5, image: image5, name: 'Kettle Chips', unitPrice: 50, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 6, image: image6, name: 'Banana Chips', unitPrice: 60, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 7, image: image7, name: 'Plantain Chips', unitPrice: 70, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 8, image: image8, name: 'Cassava Chips', unitPrice: 80, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 9, image: image9, name: 'Sweet Potato Chips', unitPrice: 90, weight: ['100g', '250g', '500g', '1kg'] },
//         { id: 10, image: image10, name: 'Tortilla Chips', unitPrice: 100, weight: ['100g', '250g', '500g', '1kg'] }
//     ]
// };
export default function Invoice() {
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState(Array(products.length).fill(Number()));
    const [discounts, setDiscounts] = useState(Array(products.length).fill(0));
    const [giftCount, setGiftCount] = useState(Array(products.length).fill(0));
    const [specialRebate, setSpecialRebate] = useState(0);
    const [cash, setCash] = useState(0);
    const [cheque, setCheque] = useState(0);
    const [onlinePayment, setOnlinePayment] = useState(0);


    //get products
    useEffect(() => {
        fetch('http://localhost:5000/products')
  .then(response => response.json())  // Parse the JSON from the response
  .then(data => {
    console.log(data);
    setProducts(data)  // Handle the data from the response
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
    }, [])

    // Save products to local storage whenever they are updated
    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);


    // Define weight options and corresponding unit prices
    const weightOptions = {
        '100g': 50,
        '250g': 100,
        '500g': 150,
        '1kg': 250
    };

    // Handle weight change and update unit price accordingly
    const handleWeightChange = (index, event) => {
        const newWeight = event.target.value;
        const newProducts = [...products];
        newProducts[index].weight = newWeight;
        newProducts[index].unitPrice = weightOptions[newWeight];
        setProducts(newProducts);
    }


    // Handle quantity change
    const handleQuantityChange = (index, event) => {
        const newQuantities = [...quantities];
        newQuantities[index] = Number(event.target.value);
        setQuantities(newQuantities);
    };

    // Handle gift item change
    const handleGiftCount = (index, event) => {
        const newGiftCount = [...giftCount];
        newGiftCount[index] = Number(event.target.value);
        setGiftCount(newGiftCount);
    };

    // Handle discount change
    const handleDiscountChange = (index, event) => {
        const newDiscounts = [...discounts];
        newDiscounts[index] = Number(event.target.value);
        setDiscounts(newDiscounts);
    };

    // Handle special rebate change
    const handleSpecialRebate = (event) => {
        const newSpecialRebate = Number(event.target.value);
        setSpecialRebate(newSpecialRebate);
    };

    // Handle cash change
    const handleCash = (event) => {
        const cashAmount = Number(event.target.value);
        setCash(cashAmount);
    };

    // Handle cheque change
    const handleCheque = (event) => {
        const checkAmount = Number(event.target.value);
        setCheque(checkAmount);
    };

    // Handle cheque change
    const handleOnlinePayment = (event) => {
        const onlinePaymentAmount = Number(event.target.value);
        setOnlinePayment(onlinePaymentAmount);
    };

    //calculate sales
    const calculateSales = (price, quantity) => {
        return price * quantity;
    };

    // Calculate discounted price
    const calculateDiscountedPrice = (sales, discount) => {
        return sales - (sales * (discount / 100));
    };

    // Calculate totals
    const totalQuantity = quantities.reduce((acc, curr) => acc + curr, 0);
    const totalSales = products.reduce((acc, product, index) => acc + (isNaN(calculateSales(product.unitPrice, quantities[index])) ? 0 : calculateSales(product.unitPrice, quantities[index])), 0);
    const totalDiscountedPrice = products.reduce((acc, product, index) => {
        const sales = calculateSales(product.unitPrice, quantities[index]);
        return acc + (isNaN(calculateDiscountedPrice(sales, discounts[index]) ? 0 : calculateDiscountedPrice(sales, discounts[index])));
    }, 0);

    const finalPrice = (calculateDiscountedPrice(calculateSales(unitPrice, quantities[index]), discounts[index]).toFixed(2)) ? 
    calculateDiscountedPrice(calculateSales(product.unitPrice, quantities[index]), discounts[index]).toFixed(2) :
    '0.00';

    const safeFinalPrice = isNaN(finalPrice) ? '0.00' : finalPrice;


    const totalDiscount = totalSales - totalDiscountedPrice;
    const totalGiftCount = giftCount.reduce((acc, curr) => acc + curr, 0);

    //Net Sales 
    const netSales = totalDiscountedPrice - specialRebate;

    //Total Collection Amount
    const totalCollectionAmount = cash + cheque + onlinePayment;

    // Due/Surplus count
    const dueSurplus = netSales - totalCollectionAmount;


    //download pdf
    const contentRef = useRef();

    const handleDownloadPdf = () => {
        const input = contentRef.current;
        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');

            // Create a new jsPDF instance
            const pdf = new jsPDF({
                orientation: 'portrait', // or 'landscape'
                unit: 'pt', // points, can be 'mm', 'cm', 'in'
                format: 'a4' // or [width, height] for custom dimensions
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const adjustedWidth = imgWidth * ratio;
            const adjustedHeight = imgHeight * ratio;

            // Add the image to the PDF
            pdf.addImage(imgData, 'PNG', 0, 0, adjustedWidth, adjustedHeight);

            // Get the current date
            const currentDate = new Date().toLocaleDateString();

            // Add the date to the PDF
            pdf.setFontSize(12);
            pdf.text(`Date: ${currentDate}`, 10, pdfHeight - 10);

            // Save the PDF
            pdf.save('Invoice.pdf');
        });
    };

    // real date
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString();
    };

    //real time
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString();
    };

    //by default cursor
    const inputRef = useRef(null);

    useEffect(() => {
        // Set focus on the input element when the component is mounted
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>Invoice</title>
            </Helmet>
            <div ref={contentRef} style={{ padding: 10, }}>
                <div className="note-header pt-3">
                    <div className="container-fluid">
                        <div className="row p-2">
                            <div className="col-12">
                                <div className="address border-bottom border-dark border-2 ">
                                    <h3 className="mb-1">RS Communication Limited</h3>
                                    <div className="row">
                                        <div className="col-12">
                                            <h6 className="mb-3">23/D/1 (1st Floor), Free School Street, Box Culvert Road, Panthapath, Dhaka-1205, Bangladesh</h6>
                                            <h6>Phone : +8809611677154, email: info@rscombd.com, web: www.rscombd.com</h6        >
                                        </div>
                                    </div>
                                </div>
                                <h5 className='my-4'>INVOICE</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="introduction mb-4">
                    <div className="container-fluid text-center text-start">
                        <div className="row">
                            <div className="col-3">
                                <div className="row mb-2">
                                    <div className="col-6 text-start" ref={inputRef}>Mobile No :</div>
                                    <div className="col-6">
                                        <input className="border border-0 p-1 fw-bold" style={{ width: '200px', padding: '5px', backgroundColor: '#f7f7f7' }} type="number" name="" id="" />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-start">Customer's Name :</div>
                                    <div className="col-6">
                                        <input className="border border-0 p-1 fw-bold" style={{ width: '200px', padding: '5px', backgroundColor: '#f7f7f7' }} type="text" name="" id="" />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-start mb-2">E-mail :</div>
                                    <div className="col-6">
                                        <input className="border border-0 p-1 fw-bold text-start" style={{ width: '200px', padding: '5px', backgroundColor: '#f7f7f7' }} type="text" name="" id="" />
                                    </div>
                                </div>
                                <div className="row mb-2">
                                    <div className="col-6 text-start mb-2">Address :</div>
                                    <div className="col-6">
                                        <input className="border border-0 p-1 fw-bold" style={{ width: '200px', padding: '5px', backgroundColor: '#f7f7f7' }} type="text" name="" id="" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-3 px-5">
                                <select className="form-select form-select-sm mb-3 border-0 text-center" aria-label="Small select example">
                                    <option selected>Dhaka</option>
                                    <option value="1">Khulna</option>
                                    <option value="2">Rajshahi</option>
                                    <option value="3">Barishal</option>
                                    <option value="4">Chottrogram</option>
                                    <option value="5">Rangpur</option>
                                    <option value="6">Mymansangh</option>
                                    <option value="7">Sylhet</option>
                                </select>
                                <select className="form-select form-select-sm mb-3 border-0 text-center" aria-label="Small select example">
                                    <option selected>RD</option>
                                    <option value="1">Brandshop</option>
                                    <option value="2">Corporate</option>
                                    <option value="2">Retail</option>
                                    <option value="2">Others</option>
                                </select>
                                <select className="form-select form-select-sm mb-3 border-0 text-center" aria-label="Small select example">
                                    <option selected>Trade Receivable</option>
                                    <option value="1">Other Receivable</option>
                                </select>
                            </div>
                            <div className="col-3">
                                <div className="row mb-4">
                                    <div className="col-6 text-start">Invoice No :</div>
                                    <div className="col-6">01</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-6 text-start">Invoice Date :</div>
                                    <div className="col-6">{formatDate(currentDate)}</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-6 text-start mb-2">Sales Order No :</div>
                                    <div className="col-6">S861268</div>
                                </div>
                            </div>
                            <div className="col-3">
                                <div className="row mb-4">
                                    <div className="col-6 text-start">By :</div>
                                    <div className="col-6">@Name</div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-6 text-start">Time :</div>
                                    <div className="col-6">{formatTime(currentTime)}
                                    </div>
                                </div>
                                <div className="row mb-4">
                                    <div className="col-6 text-start mb-2">Previous Due :</div>
                                    <div className="col-6">00</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table className='width table table-bordered ' style={{ borderCollapse: Collapse, width: '100%' }}>
                    <tr className='height-25'>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '50px' }}>P. ID</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '120px' }}>Product Image</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '150px' }}>Product Name</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '100px' }}>SQ</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '100px' }}>Quantity</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '100px' }}>Unit Price</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '100px' }}>Sales</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '90px' }}>Discount</th>
                        <th className='border border-dark border-2' rowSpan={2} style={{ width: '170px' }}>Total</th>
                        <th className='border border-dark border-2' colSpan={2}>Gift</th>
                    </tr>
                    <tr className='height-25'>
                        <th className='border border-dark border-2' style={{ width: '50px' }}>Quantity</th>
                        <th className='border border-dark border-2' >Item</th>
                    </tr>

                    {products.map((product, index) => (
                        <tr key={product.id}>
                            <td className='border border-dark border-2 fw-bold'>{product.id}</td>
                            <td className='border border-dark border-2 fw-bold'>
                                <img style={{ width: '60px', height: '60px' }} src={product.image} alt={product.image} />
                            </td>
                            <td className='border border-dark border-2 fw-bold'>{product.name}</td>
                            <td className='border border-dark border-2 fw-bold'>
                                <select value={product.weight} onChange={(event) => handleWeightChange(index, event)} className="form-select form-select-sm mb-3 text-center" aria-label="Small select example">
                                    {Object.keys(weightOptions).map((weight) => (
                                        <option key={weight} value={weight}>{weight}</option>
                                    ))}
                                </select>
                            </td>
                            <td className='border border-dark border-2 fw-bold text-center p-1'>
                                <input className="text-center fw-bold" type="number"
                                    onChange={(event) => handleQuantityChange(index, event)}
                                    value={quantities[index]}
                                    min="0" style={{ width: '100%', padding: '5px', border: 'none' }} name="" id="" />
                            </td>
                            <td className='border border-dark border-2 fw-bold text-end p-1'>{product.unitPrice}</td>
                            <td className='border border-dark border-2 fw-bold text-end p-1'>{isNaN(calculateSales(product.unitPrice, quantities[index])) ? 0 : calculateSales(product.unitPrice, quantities[index])}</td>
                            <td className='border border-dark border-2 fw-bold text-center p-1'>
                                <input className="text-center fw-bold" type="number"
                                    value={discounts[index]}
                                    onChange={(event) => handleDiscountChange(index, event)}
                                    style={{ width: '60px', padding: '3px', border: 'none' }} name="" id="" />%
                            </td>
                            <td className='border border-dark border-2 fw-bold text-end p-1'>{safeFinalPrice}</td>
                            <td className='border border-dark border-2 fw-bold text-end p-1'>
                                <input className="text-center fw-bold"
                                    onChange={(event) => handleGiftCount(index, event)}
                                    value={giftCount[index]}
                                    type="number" style={{ width: '100%', padding: '5px', border: 'none' }} name="" id="" />
                            </td>
                            <td className='border border-dark border-2 fw-bold text-end p-1'>
                                <input className="text-start fw-bold" type="text" style={{ width: '100%', padding: '5px', border: 'none' }} name="" id="" />
                            </td>
                        </tr>
                    ))}

                    <br />
                    <tr>
                        <td className='border border-dark border-2 fw-bold' colSpan={4}>Total</td>
                        <td className='border border-dark border-2 fw-bold text-center p-1'>{totalQuantity}</td>
                        <td className='border border-dark border-2 fw-bold'></td>
                        <td className='border border-dark border-2 fw-bold text-end p-1'>{totalSales}</td>
                        <td className='border border-dark border-2 fw-bold text-center p-1'>{totalDiscount.toFixed(2)}</td>
                        <td className='border border-dark border-2 fw-bold text-end p-1'>{totalDiscountedPrice}</td>
                        <td className='border border-dark border-2 fw-bold'>{totalGiftCount} Pch</td>
                        <td className='border border-dark border-2 fw-bold'></td>
                    </tr>
                </table>
                <div className=' d-flex justify-content-end mb-3'>
                    <Link type="button" to='/addProducts' className="btn btn-outline-success">Add New Product</Link>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row border-btm-2">
                            <div className="col-6 text-end fw-bold p-1 mt-1">Discount/Special rebate :</div>
                            <div className="col-6 text-end fw-bold pe-2">
                                <input className="text-end p-1 pe-2 mb-2 fw-bold"
                                    onChange={(event) => handleSpecialRebate(event)}
                                    value={specialRebate}
                                    type="number" name="" id="" />
                            </div>
                        </div>
                    </div>

                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row border-btm-2">
                            <div className="col-6 text-end fw-bold p-2">Net Sales :</div>
                            <div className="col-6 text-end fw-bold p-2 pe-3">{isNaN(netSales.toFixed(2)) ? 0 : netSales.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row">
                            <div className="col-6 text-end fw-bold p-1 mt-2">Cash :</div>
                            <div className="col-6 text-end fw-bold p-2">
                                <input className="text-end fw-bold p-1 pe-2" type="number"
                                    onChange={(event) => handleCash(event)}
                                    value={cash}
                                    name="" id="" /></div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row">
                            <div className="col-6 text-end fw-bold p-1 mt-2">Cheque (uncollected) :</div>
                            <div className="col-6 text-end fw-bold p-2">
                                <input className="text-end fw-bold p-1 pe-2" type="number"
                                    onChange={(event) => handleCheque(event)}
                                    value={cheque}
                                    name="" id="" /></div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row border-btm-2">
                            <div className="col-6 text-end mt-2">
                                <select className="form-select form-select-sm mb-1 fw-bold text-center p-1" aria-label="Small select example">
                                    <option selected>bKash</option>
                                    <option value="1">Rocket</option>
                                    <option value="2">Nagad</option>
                                    <option value="3">Upay</option>
                                </select>
                            </div>
                            <div className="col-6 text-end fw-bold p-2 mb-3">
                                <input className="text-end fw-bold p-1 pe-2" type="number"
                                    onChange={(event) => handleOnlinePayment(event)}
                                    value={onlinePayment}
                                    name="" id="" /></div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row border-btm-2">
                            <div className="col-6 text-end fw-bold p-2">Total Collection :</div>
                            <div className="col-6 text-end fw-bold p-2 pe-3">{totalCollectionAmount.toFixed(2) || 0}</div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row border-btm-2">
                            <div className="col-6 text-end fw-bold p-2">Due/Surplus :</div>
                            <div className="col-6 text-end fw-bold p-2 pe-3">{isNaN(dueSurplus.toFixed(2)) ? 0 : dueSurplus.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <div className="row">
                    <div className="col-5"></div>
                    <div className="col-4">
                        <div className="row border-btm-2">
                            <div className="col-6 text-end fw-bold"></div>
                            <div className="col-6 text-end fw-bold"></div>
                        </div>
                    </div>
                    <div className="col-3"></div>
                </div>
                <br className='border-btm-2' />
                <div className="row mb-3">
                    <div className="col-6">Customer's Acknowledgment</div>
                    <div className="col-6">RS Communication Limited</div>
                </div>
                <div className="row border-btm-2">
                    <div className="col-6">info@usabd.com  /Card # 31223_6440_0005_2324</div>
                    <div className="col-6">@Name</div>
                </div>
                <p className="text-center">This is computer generated invoice which does not require any signature.</p>
            </div>
            <button onClick={handleDownloadPdf} type="button" className="btn btn-outline-success my-4">Download as pdf</button>

        </>
    )
}