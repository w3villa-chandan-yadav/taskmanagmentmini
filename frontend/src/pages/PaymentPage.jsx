import React, { useState } from 'react';
import { BsCheckCircle } from 'react-icons/bs';
import { FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addUserLogin } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';


const plans = [
  {
    name: 'Free Plan (Basic)',
    price: '$0',
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
    period: 'per month',
    features: [
      'Dedicated infrastructure for your applications',
      'Advanced security features, compliance support',
      'Unlimited or negotiable usage limits',
      'Ability to download task from any where'
    ],
    background: 'bg-gradient-to-b from-[#1a1a1a] to-[#131313]',
  },
];

const PaymentPlans = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
      const { userDetails } = useSelector((state) => state.user);
      const dispatch = useDispatch()


  const handleSelect = (index) => {
    if(index === 0){
      return
    }
    setSelectedPlan(index);
     
    const plane = index === 1 ? { paymentAmoutn: 400,tier:"silver"} : { paymentAmoutn: 700,tier:"gold"}

    fetchPayment( plane)
  };



     const fetchPayment = async (plan)=>{
        try {

            const data = await fetch("https://taskmanagmentmini.onrender.com/payment/v1/createPayment",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: userDetails.token,
                },
                body: JSON.stringify(plan)
            })
            const result = await data.json();

            // console.log(result)

            if(!result.success){
              toast.success(result.message)
              return
            }


            const options ={
                key: "rzp_test_DWYqJIt4IyNzn8",
                amount: result?.data?.amount,
                currency: result?.data?.currency,
                name: result?.data?.name,
                description: "Test Transaction",
                order_id: result?.data?.id,
                handler: async (response)=>{
                    
                    // console.log(response)


                      const data = await fetch("https://taskmanagmentmini.onrender.com/payment/v1/verify",{
                        method: "POST",
                        headers:{
                            "Content-Type": "application/json",
                            Authorization: userDetails.token,
                        },
                        body : JSON.stringify( {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            tier: plan.tier,
                          })
                      })

                      const result = await data.json();

                      // console.log(result)

                      if(result.success){
                          sessionStorage.setItem("user", JSON.stringify({...userDetails, tier: plan.tier}))
                                      dispatch(addUserLogin({...userDetails, tier: plan.tier}))
                                      toast.success("Tier upgraded")
                      }else{
                        toast.error("please Try after some time")
                      }
                }
            }

            const rzp = new Razorpay(options)

            rzp.open()
            
        } catch (error) {
            console.log("error in the fetchPayment")
        }
    }






  return (
    <div className="h-screen overflow-y-auto hiddeScrollBar bg-[#0f0f0f] text-white py-12 px-4 md:px-16">
      <h2 className="text-center text-3xl md:text-4xl font-semibold mb-12">Choose Your Plan</h2>

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
                <p className="text-3xl font-bold">{plan.price}</p>
                <p className="text-sm text-gray-400 mb-4">{plan.period}</p>
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
