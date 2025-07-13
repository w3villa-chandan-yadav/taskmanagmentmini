const { razorpay } = require("../config/rzorpay.config");
const crypto = require("crypto");
const { userModel } = require("../modles/user.Models");
const { ApiError } = require("../middleware/error.Middleware");


const paymentCachup = async (req, res, next)=>{
    try {

        const userId = req.user.id

        const { paymentAmoutn, tier } = req.body;

        console.log("this is paymentCachup", paymentAmoutn, tier, userId)

         const isAlreadyhave =  await userModel.findByPk(userId)


         if(isAlreadyhave.tier === tier || isAlreadyhave.tier === 'gold'){
            return res.status(200).json({
                success: false,
                message: "You alheady have this tier"
            })
         }

         console.log("mododododod", isAlreadyhave)


        const options ={
            amount: paymentAmoutn*100,
            currency: "INR",
            receipt: "order_instain_1"
        }



        const responce = await razorpay.orders.create(options)

        // , function(err, order){

        // })

        res.status(200).json({
            success: true,
            message: "order created successfully",
            data : responce
        })
        
    } catch (error) {
        console.log("error in payment controller", error);
        next( new ApiError(500, SERVER.INTERNALERROR))
    }
}


// const verifyingPayment = async (req, res, next)=>{
//     try {
//         console.log("inside the payment verification")
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

//         // console.log(razorpay_order_id, razorpay_payment_id, razorpay_signature)

//         const signature  = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");


//         console.log(signature)

//         if(!razorpay_signature === signature){
//         return res.status(401).json({
//             success: false,
//             message: "please try after some time"
//         })

//         }

//         res.status(200).json({
//             success: true,
//             message: "Tier updated successfully"
//         })
        
//     } catch (error) {
//         console.log("error in verifying the payment")
//     }
// }


const verifyingPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tier } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(401).json({
        success: false,
        message: "Payment verification failed. Please try again.",
      });
    }

    const userId = req.user.id; 

    await userModel.update({ tier }, { where: { id: userId } });

    res.status(200).json({
      success: true,
      message: `Tier upgraded to ${tier} successfully.`,
    });
  } catch (error) {
    console.error("Error in verifying payment:", error);
    next(new ApiError(500, "Internal Server Error"));
  }
};



module.exports =  { paymentCachup , verifyingPayment }