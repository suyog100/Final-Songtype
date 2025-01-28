"use client";
import { useEffect, useState } from "react";
import { Heart, DollarSign } from "lucide-react";
import axios from "axios";

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalDonations, setTotalDonations] = useState(0);

  const getDonations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/donations/all",
      );
      const result = await response.data;
      if (result.donations) {
        setDonations(result.donations);
        const total = result.donations.reduce(
          (sum, donation) => sum + donation.amount,
          0,
        );
        setTotalDonations(total);
      }
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDonations();
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='flex space-x-2'>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce'></div>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150'></div>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-300'></div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-slate-200 py-12 px-4 sm:px-6 lg:px-8 rounded-md'>
      {/* Header Section */}
      <div className='max-w-7xl mx-auto mb-12'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 sm:text-4xl'>
            Our Generous Donors
          </h2>
          <p className='mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4'>
            Together we've raised Rs. {totalDonations} for our cause
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className='max-w-7xl mx-auto mb-12'>
        <div className='bg-slate-100 rounded-lg shadow-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='text-center'>
            <p className='text-lg text-gray-600'>Total Donors</p>
            <p className='text-3xl font-bold text-gray-900'>
              {donations.length}
            </p>
          </div>
          <div className='text-center border-l border-r border-gray-200'>
            <p className='text-lg text-gray-600'>Total Raised</p>
            <p className='text-3xl font-bold text-gray-900'>
              Rs. {totalDonations}
            </p>
          </div>
          <div className='text-center'>
            <p className='text-lg text-gray-600'>Average Donation</p>
            <p className='text-3xl font-bold text-gray-900'>
              Rs.{" "}
              {donations.length
                ? Math.round(totalDonations / donations.length)
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Donations Grid */}
      <div className='max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {donations.length > 0 ? (
            donations.map((donation) => (
              <div
                key={donation._id}
                className='bg-slate-100 overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
              >
                <div className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center space-x-3'>
                      <div className='bg-pink-100 rounded-full p-2'>
                        <Heart className='h-6 w-6 text-pink-500' />
                      </div>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {donation.user.username}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {donation.user.email}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center text-green-600 font-medium'>
                      <span>Rs. {donation.amount}</span>
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>
                    Donation ID: {donation._id}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-12'>
              <p className='text-gray-500 text-lg'>No donations found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
