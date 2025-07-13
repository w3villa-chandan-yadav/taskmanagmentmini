import React, { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addUserLogin } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';


const plans = [
  {
    name: 'Free Plan (Basic)',
    price: '₹0',
    discountedPrice: '₹0', // No discount
    period: 'per month',
    features: [
      'Basic access to only to personal use',
      'Support and limited documentation access',
      'Limited usage or credits',
    ],
    background: 'bg-gradient-to-b from-[#1a1a1a] to-[#121212]',
  },
  {
    name: 'Pro Plan',
    price: '₹400',
    discountedPrice: '₹299',
    period: 'per month',
    features: [
      'Advanced tools like create Group',
      'Higher API rate limits for faster integrations',
      'Usage: unlimited groups',
      '+100 users can join',
    ],
    background: 'bg-gradient-to-b from-[#1a1a1a] to-[#0c1d0e]',
  },
  {
    name: 'Enterprise Plan',
    price: '₹700',
    discountedPrice: '₹499',
    period: 'per month',
    features: [
      'Dedicated infrastructure for your applications',
      'Advanced security features, compliance support',
      'Unlimited or negotiable usage limits',
      'Ability to download task from anywhere',
    ],
    background: 'bg-gradient-to-b from-[#1a1a1a] to-[#131313]',
  },
];


const PaymentPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isDiscountLive, setIsDiscountLive] = useState(true);
  const { userDetails } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [saleTimeLeft, setSaleTimeLeft] = useState(null);
// const saleEndTime = new Date(Date.now() + 3 * 60 * 60 * 1000);
const [saleEndTime, setSaleEndTime] = useState(null); // will be from backend


  useEffect(() => {
    const fetchDiscountStatus = async () => {
      try {
        const res = await fetch('https://taskmanagmentmini.onrender.com/payment/v1/discountCount');
        const data = await res.json();
        console.log("diconie", data)
        setIsDiscountLive(data.isDiscountLive);
      if (data.isDiscountLive && data.endTime) {
        setSaleEndTime(new Date(data.endTime));
      }      } catch (err) {
        console.error('Failed to fetch discount status:', err);
      }
    };

    fetchDiscountStatus();
  }, []);


// Set your sale end time (example: today + 3 hours)

// useEffect(() => {
//   if (!isDiscountLive) return;

//   const interval = setInterval(() => {
//     const now = new Date();
//     const timeLeft = saleEndTime - now;

//     if (timeLeft <= 0) {
//       clearInterval(interval);
//       setSaleTimeLeft(null);
//       return;
//     }

//     const hours = String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, '0');
//     const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, '0');
//     const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, '0');

//     setSaleTimeLeft(`${hours}:${minutes}:${seconds}`);
//   }, 1000);

//   return () => clearInterval(interval);
// }, [isDiscountLive]);




useEffect(() => {
  if (!isDiscountLive || !saleEndTime) return;

  const interval = setInterval(() => {
    const now = new Date();
    const timeLeft = saleEndTime - now;

    if (timeLeft <= 0) {
      setSaleTimeLeft(null);
      clearInterval(interval);
      return;
    }

    const hours = String(Math.floor((timeLeft / (1000 * 60 * 60)) % 24)).padStart(2, '0');
    const minutes = String(Math.floor((timeLeft / (1000 * 60)) % 60)).padStart(2, '0');
    const seconds = String(Math.floor((timeLeft / 1000) % 60)).padStart(2, '0');

    setSaleTimeLeft(`${hours}:${minutes}:${seconds}`);
  }, 1000);

  return () => clearInterval(interval);
}, [isDiscountLive, saleEndTime]);



  const handleSelect = (index) => {
    if (index === 0) return;
    setSelectedPlan(index);

    const basePrice = index === 1 ? 400 : 700;
    const discountPrice = index === 1 ? 299 : 499;
    const tier = index === 1 ? 'silver' : 'gold';

    const plan = {
      paymentAmoutn: isDiscountLive ? discountPrice : basePrice,
      tier,
    };

    fetchPayment(plan);
  };

  const fetchPayment = async (plan) => {
    try {
      const response = await fetch("https://taskmanagmentmini.onrender.com/payment/v1/createPayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: userDetails.token,
        },
        body: JSON.stringify(plan),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      const options = {
        key: "rzp_test_DWYqJIt4IyNzn8",
        amount: result?.data?.amount,
        currency: result?.data?.currency,
        name: result?.data?.name,
        description: "Test Transaction",
        order_id: result?.data?.id,
        handler: async (response) => {
          const verifyRes = await fetch("https://taskmanagmentmini.onrender.com/payment/v1/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: userDetails.token,
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tier: plan.tier,
            }),
          });

          const verifyResult = await verifyRes.json();

          if (verifyResult.success) {
            sessionStorage.setItem("user", JSON.stringify({ ...userDetails, tier: plan.tier }));
            dispatch(addUserLogin({ ...userDetails, tier: plan.tier }));
            toast.success("Tier upgraded");
          } else {
            toast.error("Please try again later");
          }
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("Error in fetchPayment:", error);
    }
  };

  return (
    <div className="h-screen overflow-y-auto hiddeScrollBar bg-[#0f0f0f] text-white py-12 px-4 md:px-16">
      <h2 className="text-center text-3xl md:text-4xl font-semibold mb-12">Choose Your Plan</h2>

{isDiscountLive && saleTimeLeft && (
  <div className="bg-gradient-to-r from-green-600 to-green-500 text-white text-center py-3 rounded-lg mb-8 shadow-lg">
    Sale is live 🔥! Ends in <span className="font-mono font-semibold">{saleTimeLeft}</span>
  </div>
)}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan, index) => {
          const isSelected = selectedPlan === index;

          return (
            <div
              key={index}
              onClick={() => handleSelect(index)}
              className={`${plan.background} rounded-xl border transition-transform transform hover:scale-[1.02] cursor-pointer p-6 flex flex-col justify-between shadow-md
                ${isSelected
                  ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                  : 'border-gray-700'}`}
            >
              {/* Header */}
              <div>
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

                <div className="mb-1">
                  {isDiscountLive && plan.discountedPrice ? (
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl line-through text-gray-400">{plan.price}</p>
                      <p className="text-3xl font-bold text-green-400">{plan.discountedPrice}</p>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">{plan.price}</p>
                  )}
                  <p className="text-sm text-gray-400">{plan.period}</p>
                </div>
              </div>

              {/* Features */}
              <ul className="text-sm text-gray-300 flex-1 mb-4 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <BsCheckCircle className="text-green-400 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full mt-auto py-2 px-4 text-sm rounded-md text-white flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-green-600 hover:bg-green-500'
                    : 'bg-[#1f1f1f] hover:bg-[#2a2a2a]'
                }`}
              >
                {isSelected ? 'Selected' : 'Get Started'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentPlans;