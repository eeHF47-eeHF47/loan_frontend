import { useState } from 'react';
import axios from 'axios';
import { FiLoader, FiUser, FiDollarSign, FiCreditCard, FiBriefcase, FiHome, FiSliders } from 'react-icons/fi';

const LoanForm = () => {
    const [formData, setFormData] = useState({
        Age: '',
        incomeSource: '',
        dependents: '',
        annualIncome: '',
        creditScore: '',
        dti: '',
        purpose: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const validateField = (name, value) => {
      // validation
        let newErrors = { ...errors };
        switch (name) {
            case 'Age':
                if (!value) {
                   newErrors[name] = 'Age is required';
                } else if (!/^\d+$/.test(value)) {
                  newErrors[name] = 'Age must be a number';
                } else if (parseInt(value) < 20 || parseInt(value) > 65) {
                    newErrors[name] = 'Age must be between 20 and 65.';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'incomeSource':
                if (!value) {
                   newErrors[name] = 'Income Source is required';
                 } else if (!/^[A-Za-z ]+$/.test(value)) {
                    newErrors[name] = 'Income Source must contain only letters and spaces.';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'dependents':
                if (!value) {
                  newErrors[name] = 'Number of dependents is required';
                } else if (!/^\d+$/.test(value)) {
                    newErrors[name] = 'Number of dependents must be a number';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'annualIncome':
                if (!value) {
                   newErrors[name] = 'Annual Income is required';
                } else if (!/^\d+$/.test(value)) {
                    newErrors[name] = 'Annual Income must be a number';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'creditScore':
                 if (!value) {
                   newErrors[name] = 'Credit Score is required';
                } else if (!/^\d+(\.\d+)?$/.test(value)) {
                   newErrors[name] = 'Credit Score must be a number';
                }
                else {
                    delete newErrors[name];
                }
                break;
            case 'dti':
               if (!value) {
                 newErrors[name] = 'DTI is required';
                } else if (!/^\d+(\.\d+)?$/.test(value)) {
                    newErrors[name] = 'DTI must be a number';
                } else {
                    delete newErrors[name];
                }
                break;
            case 'purpose':
                if (!value) {
                    newErrors[name] = 'Purpose of loan is required';
                } else if (!/^[A-Za-z ]+$/.test(value)) {
                    newErrors[name] = 'Purpose must contain only letters and spaces.';
                } else {
                    delete newErrors[name];
                }
                break;
             default:
               break;
        }
        setErrors(newErrors);
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
      if (formSubmitted) {
        validateField(name,value)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormSubmitted(true)
        const formErrors = Object.keys(formData).reduce((acc,key)=>{
             validateField(key,formData[key])
               if(errors[key]){
                  acc[key] = errors[key];
               }
                return acc
           },{})
        if(Object.keys(formErrors).length > 0){
            return;
        }
        setLoading(true);
        setErrors({});
           
        try {
            const response = await axios.post('https://watery-cheslie-solutyics-efc6f698.koyeb.app/predict', {    //  <- api url
                // data created as for backend request  
                Age: parseInt(formData.Age),
                'Source of Income': formData.incomeSource,
                'No of Dependents': parseInt(formData.dependents),
                'Annual Income': parseInt(formData.annualIncome),
                'Credit Score': parseFloat(formData.creditScore),      
                DTI: parseFloat(formData.dti),
                Purpose: formData.purpose,
            });
            setResponseData(response.data);
            console.log(response.data);
        } catch (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            setErrors(error.response.data.error);
          } else if (error.request) {
            // The request was post  but no response was received xm
            setErrors({general: 'Network error, please try again later.'});
          } else {
            // if any general error Happend
           setErrors({general: error.message});
          }
        } finally {
          setLoading(false);
        }
    };


    return (
        <div className="max-w-2xl mx-auto mt-20 p-6 bg-white shadow-lg rounded-lg">
            <div className='grid grid-cols-2'>
                <div>
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Loan Application Form</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Age Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiUser className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="Age"
                                name="Age"
                                value={formData.Age}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.Age ? 'border-red-500':''}`}
                                placeholder="Enter Age"
                                onBlur={()=>{validateField("Age",formData.Age)}}
                            />
                           {errors.Age && <p className="text-red-500 text-sm mt-1">{errors.Age}</p>}
                        </div>

                        {/* Source of Income Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiBriefcase className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="incomeSource"
                                name="incomeSource"
                                value={formData.incomeSource}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.incomeSource ? 'border-red-500':''}`}
                                placeholder="Source of Income"
                                onBlur={()=>{validateField("incomeSource",formData.incomeSource)}}

                            />
                           {errors.incomeSource && <p className="text-red-500 text-sm mt-1">{errors.incomeSource}</p>}

                        </div>

                        {/* Dependents Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiSliders className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="dependents"
                                name="dependents"
                                value={formData.dependents}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.dependents ? 'border-red-500':''}`}
                                placeholder="Number of Dependents"
                                onBlur={()=>{validateField("dependents",formData.dependents)}}

                            />
                         {errors.dependents && <p className="text-red-500 text-sm mt-1">{errors.dependents}</p>}

                        </div>

                        {/* Annual Income Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiDollarSign className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="annualIncome"
                                name="annualIncome"
                                value={formData.annualIncome}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.annualIncome ? 'border-red-500':''}`}
                                placeholder="Annual Income"
                                onBlur={()=>{validateField("annualIncome",formData.annualIncome)}}

                            />
                           {errors.annualIncome && <p className="text-red-500 text-sm mt-1">{errors.annualIncome}</p>}
                        </div>

                        {/* Credit Score Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiCreditCard className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="creditScore"
                                name="creditScore"
                                value={formData.creditScore}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.creditScore ? 'border-red-500':''}`}
                                placeholder="Credit Score"
                                onBlur={()=>{validateField("creditScore",formData.creditScore)}}

                            />
                          {errors.creditScore && <p className="text-red-500 text-sm mt-1">{errors.creditScore}</p>}

                        </div>

                        {/* DTI Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiHome className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="dti"
                                name="dti"
                                value={formData.dti}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.dti ? 'border-red-500':''}`}
                                placeholder="DTI (Debt-to-Income)"
                                onBlur={()=>{validateField("dti",formData.dti)}}
                            />
                          {errors.dti && <p className="text-red-500 text-sm mt-1">{errors.dti}</p>}

                        </div>

                        {/* Purpose Input */}
                        <div className="mb-4 flex items-center border border-gray-300 rounded-md">
                            <FiHome className="text-gray-600 text-xl ml-3" />
                            <input
                                type="text"
                                id="purpose"
                                name="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                                className={`mt-2 block w-full px-4 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.purpose ? 'border-red-500':''}`}
                                placeholder="Purpose of Loan"
                                onBlur={()=>{validateField("purpose",formData.purpose)}}

                            />
                             {errors.purpose && <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>}

                        </div>

                        {/* Submit Button */}
                        <div className="text-center">
                            <button
                                type="submit"
                                className="w-full py-2 px-4 bg-teal-600 text-white font-semibold rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                   

                </div>
                <div className='mt-4'>
                    <h1 className='text-2xl font-semibold text-center text-teal-600 mt-6'> Prediction results  </h1>
                    {loading && (
                        <div className="flex justify-center items-center mt-4">
                            <FiLoader className="animate-spin text-teal-600 text-3xl" />
                        </div>
                    )}

                    {responseData && (
                        <div className="mt-4 p-4 bg-teal-100 border border-teal-300 rounded-md">
                            <h3 className="font-semibold text-teal-800">Response:</h3>
                            <pre className="text-sm text-teal-700">{responseData}</pre>
                        </div>
                    )}

{errors.general && <p className="text-red-500 text-center mt-4">{errors.general}</p>}

                </div>
            </div>
        </div>
    );
};

export default LoanForm;
