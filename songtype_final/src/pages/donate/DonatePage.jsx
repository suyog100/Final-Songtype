import { SVGProps, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios, { isAxiosError } from "axios";

export default function DonatePage() {
  const { id } = useParams();
  const [goalAmount, setGoalAmount] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(0);

  const handlePayment = async () => {
    const url = `http://localhost:3000/api/esewa/donate`;
    const data = {
      donationAmount: investmentAmount,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("THE RESPONSE DATA IS", response);
      if (response.status >= 200 && response.status < 300) {
        const responseData = response.data;
        console.log(responseData);
        if (responseData.payment_method === "esewa") {
          esewaCall(responseData.formData);
        }
      } else {
        console.error("Failed to fetch:", response.status, response.statusText);
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error("Error during fetch:", error.response);
      }
    }
  };

  const esewaCall = (formData) => {
    console.log(formData);
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (const key in formData) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className='flex flex-col'>
      <section className='w-full py-12 md:py-24 lg:py-32'>
        <div className='container px-4 md:px-6 bg-slate-200 rounded-md shadow-md flex justify-center flex-col items-center py-8'>
          <div className='text-center text-3xl font-bold'>
            <h2>Contribute to the Project</h2>
          </div>

          <form
            className='space-y-4'
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment();
            }}
          >
            <div className='space-y-2 flex flex-col my-4'>
              <label htmlFor='amount' className='text-xl font-semibold'>
                Contribution Amount
              </label>
              <input
                id='amount'
                type='number'
                placeholder='Rs.5000'
                min='1'
                required
                onChange={(e) => setInvestmentAmount(+e.target.value)}
                className='rounded-sm px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <button
              type='submit'
              className='w-full
            bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline
            '
            >
              Contribute
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function CoinsIcon() {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='8' cy='8' r='6' />
      <path d='M18.09 10.37A6 6 0 1 1 10.34 18' />
      <path d='M7 6h1v4' />
      <path d='m16.71 13.88.7.71-2.82 2.82' />
    </svg>
  );
}
