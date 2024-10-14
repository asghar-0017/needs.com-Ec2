const sendDataInService = require("../services/billingService");
const dataInRepo = require('../Repository/billingRepository');
const billingDetailModel = require('../model/billingDetail');
const generateOrderId= require('../mediater/generateOrderId')
const { cloudinary,upload } = require('../services/ImageService'); 
const StretchModel = require('../model/stratchModel'); // Import the Stretch model



// const billingDetail = async (req, res) => {
//   try {
//     const data = req.body;
//     let products = req.body.products;

//     if (typeof products === 'string') {
//       products = JSON.parse(products);
//     }
//     if (!data.firstName || !data.lastName || !data.email || !data.address || !data.phone) {
//       return res.status(400).json({ message: "Please fill all required fields." });
//     }

//     data.cashOnDelivery = data.cashOnDelivery === 'true' || data.cashOnDelivery === true;

//     if (!data.cashOnDelivery && req.file) {
//       const resultData = await cloudinary.uploader.upload(req.file.path);
//       data.image = resultData.secure_url;
//     }

//     let stretchData;

//     if (data.isStituching=== 'true' || data.isStituching===true) {
//       stretchData = await StretchModel.create(data.stretchData);
//     }


//     data.orderId = generateOrderId();
//     const previousOrderCount = await billingDetailModel.countDocuments();
//     data.orderCount = previousOrderCount + 1;



//     const billingDetailData = {
//       firstName: data.firstName,
//       lastName: data.lastName,
//       email: data.email,
//       address: data.address,
//       phone: data.phone,
//       postCode:data.postCode,
//       additionalInformation:data.additionalInformation,
//       apartment:data.apartment,
//       cashOnDelivery: data.cashOnDelivery,
//       image: data.image,
//       orderId: data.orderId,
//       orderCount: data.orderCount,
//       products: products ,
//       stretchData: stretchData// Reference the stretch data ID

//     };

//     const result = await billingDetailModel.create(billingDetailData);
//     res.status(200).json({ message: 'Billing detail created successfully.', data: result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal Server Error.', error: err.message });
//   }
// };

// Route to create billing detail with image upload


const billingDetail = async (req, res) => {
  try {
    const data = req.body;
    let products = req.body.products;
    if (typeof products === 'string') {
      products = JSON.parse(products);
    }
    if (!data.firstName || !data.lastName || !data.email || !data.address || !data.phone) {
      return res.status(400).json({ message: "Please fill all required fields." });
    }

    data.cashOnDelivery = data.cashOnDelivery === 'true' || data.cashOnDelivery === true;
    data.isStitching = data.isStitching === 'true' || data.isStitching === true;

    if (req.files && req.files.cashOnDeliveryImage) {
      const cashOnDeliveryImageFile = req.files.cashOnDeliveryImage[0];
      const cashOnDeliveryResult = await cloudinary.uploader.upload(cashOnDeliveryImageFile.path);
      data.cashOnDeliveryImage = cashOnDeliveryResult.secure_url;
    }

    let stretchData;
    if (data.isStitching) {
      if (typeof data.stretchData === 'string') {
        data.stretchData = JSON.parse(data.stretchData);
      }

      if (req.files && req.files.stitchImage) {
        const stitchingImageFile = req.files.stitchImage[0];
        const stitchingResult = await cloudinary.uploader.upload(stitchingImageFile.path);
        data.stitchImage = stitchingResult.secure_url;
      }

      stretchData = await StretchModel.create(data.stretchData);
    }

    data.orderId = generateOrderId();
    const previousOrderCount = await billingDetailModel.countDocuments();
    data.orderCount = previousOrderCount + 1;

    const billingDetailData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
      phone: data.phone,
      postCode: data.postCode,
      additionalInformation: data.additionalInformation,
      apartment: data.apartment,
      cashOnDelivery: data.cashOnDelivery,
      cashOnDeliveryImage:data.cashOnDeliveryImage,
      orderId: data.orderId,
      orderCount: data.orderCount,
      products: products, 
      stretchData: stretchData
    };

    const result = await billingDetailModel.create(billingDetailData);

    res.status(200).json({ message: 'Billing detail created successfully.', data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error.', error: err.message });
  }
};





const getAllBillingDetails = async (req, res) => {
  try {
    const billingDetails = await billingDetailModel.find().populate('stretchData');
    res.status(200).json({ message: 'Billing details fetched successfully.', billingDetails });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};
const updateBillingDetail = async (req, res) => {
  try {
    const { id } = req.params; 
    let updateData = req.body;

    if (req.files && req.files.cashOnDeliveryImage) {
      const cashOnDeliveryImageFile = req.files.cashOnDeliveryImage[0];
      const cashOnDeliveryResult = await cloudinary.uploader.upload(cashOnDeliveryImageFile.path);
      updateData.cashOnDeliveryImage = cashOnDeliveryResult.secure_url;
    }

    if (req.files && req.files.stitchingImage) {
      const stitchingImageFile = req.files.stitchingImage[0];
      const stitchingResult = await cloudinary.uploader.upload(stitchingImageFile.path);
      updateData.stitchingImage = stitchingResult.secure_url;
    }

    if (updateData.isStitching === 'true' || updateData.isStitching === true) {
      if (typeof updateData.stretchData === 'string') {
        updateData.stretchData = JSON.parse(updateData.stretchData); 
      }

      if (updateData.stretchData && updateData.stretchData._id) {
        await StretchModel.findByIdAndUpdate(updateData.stretchData._id, updateData.stretchData);
      } else {
        const newStretchData = await StretchModel.create(updateData.stretchData);
        updateData.stretchData = newStretchData._id; 
      }
    }

    const updatedBillingDetail = await billingDetailModel.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: 'Billing detail updated successfully.', result: updatedBillingDetail });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error.', error: err.message });
  }
};


const deleteBillingDetail = async (req, res) => {
  try {
    const { id } = req.params;
    await sendDataInService.deleteBillingDetail(id);
    res.status(200).json({ message: 'Billing detail deleted successfully.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const changeOrderStatus = async (req, res) => {
  try {
    const  id = req.params.id;
    const { newStatus } = req.body;
    const result = await sendDataInService.changeOrderStatus(id, newStatus);
    res.status(200).json({ message: 'Order status updated successfully.', result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};
const orderStatusCounts = async (req, res) => {
  try {
    const result = await sendDataInService.getOrderStatusCounts();
    res.status(200).json({ message: 'Order status counts fetched successfully.', result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};

const getOrderByOrderId=async(req,res)=>{
  try {
    const  orderId  = req.params.orderId; 
    console.log("orderId",orderId)
    const order = await billingDetailModel
      .findOne({ orderId })

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order:", order);
    
    return res.status(200).json({ order });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while tracking the order", error });
  }

}



module.exports = {
  billingDetail,
  getAllBillingDetails,
  updateBillingDetail,
  deleteBillingDetail,
  changeOrderStatus,
  orderStatusCounts,
  getOrderByOrderId
};
