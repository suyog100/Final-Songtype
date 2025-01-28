import React, { useEffect, useState } from "react";
import { getTypingStats } from "../../Api/Api";
import { User, Mail, Lock, Eye, EyeOff, Edit, X, Check } from "lucide-react";

// SVG Icons component (keeping all the previous icons...)
const Icons = {
  User: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='w-full h-full'
    >
      <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  ),
  Mail: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
      <polyline points='22,6 12,13 2,6' />
    </svg>
  ),
  Lock: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
      <path d='M7 11V7a5 5 0 0 1 10 0v4' />
    </svg>
  ),
  Eye: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  ),
  EyeOff: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
      <line x1='1' y1='1' x2='23' y2='23' />
    </svg>
  ),
  Edit: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
      <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
    </svg>
  ),
  Check: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <polyline points='20 6 9 17 4 12' />
    </svg>
  ),
  Close: () => (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  ),
};

const TypeStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getTypingStats();
        let data = response.data;

        console.log("Typing stats:", data);

        // Calculate statistics
        const calculateStats = (data) => {
          console.log("THE DATA INSIDE CALCULATE STATS IS ", data);
          const wpms = data.data.wpm;
          const accuracies = data.data.accuracies;

          return {
            avgWpm: wpms.length
              ? Math.round(wpms.reduce((a, b) => a + b) / wpms.length)
              : 0,
            maxWpm: wpms.length ? Math.max(...wpms) : 0,
            avgAccuracy: accuracies.length
              ? Math.round(
                  (accuracies.reduce((a, b) => a + b) / accuracies.length) * 10,
                ) / 10
              : 0,
            totalTests: wpms.length,
          };
        };

        setStats(calculateStats(data));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='bg-gray-800 p-6 rounded-lg'>
        <p className='text-gray-400'>Loading statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-gray-800 p-6 rounded-lg'>
        <p className='text-red-400'>Error loading statistics</p>
      </div>
    );
  }

  return (
    <div className='bg-gray-800 p-6 rounded-lg shadow-lg px-24'>
      <h2 className='text-xl font-semibold text-gray-200 mb-6'>
        Typing Statistics
      </h2>

      <div className='space-y-6'>
        <div className='stat-card bg-gray-700 p-4 rounded-lg'>
          <div className='text-sm text-gray-400'>Average WPM</div>
          <div className='text-2xl font-bold text-gray-200'>{stats.avgWpm}</div>
        </div>

        <div className='stat-card bg-gray-700 p-4 rounded-lg'>
          <div className='text-sm text-gray-400'>Max WPM</div>
          <div className='text-2xl font-bold text-gray-200'>{stats.maxWpm}</div>
        </div>

        <div className='stat-card bg-gray-700 p-4 rounded-lg'>
          <div className='text-sm text-gray-400'>Average Accuracy</div>
          <div className='text-2xl font-bold text-gray-200'>
            {stats.avgAccuracy}%
          </div>
        </div>

        <div className='stat-card bg-gray-700 p-4 rounded-lg'>
          <div className='text-sm text-gray-400'>Total Tests</div>
          <div className='text-2xl font-bold text-gray-200'>
            {stats.totalTests}
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "suyog",
    email: "suyogmane@email.com",
    password: "********",
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsEditing(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className='flex gap-8 max-w-7xl mx-auto p-8'>
      <div className='flex flex-col items-center bg-transparent text-gray-200 p-8 rounded-lg max-w-md mx-auto relative'>
        {/* Success Message */}
        {/* {showSuccess && (
          <Alert className='mb-4 bg-green-500/10 text-green-500 border-green-500/20'>
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )} */}
        {showSuccess && (
          <div className='my-4 bg-green-500/10 text-green-500 border-green-500/20'>
            <p>Profile Successfully updated</p>
          </div>
        )}

        {/* Edit Toggle Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className='absolute top-4 left-4 p-2 rounded-full hover:bg-gray-700 transition-colors'
        >
          {isEditing ? <X className='w-5 h-5' /> : <Edit className='w-5 h-5' />}
        </button>

        {/* Profile Image Section */}
        <div className='relative mb-6 mt-8'>
          <div className='w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-gray-600'>
            {profileImage ? (
              <img
                src={profileImage}
                alt='Profile'
                className='w-full h-full object-cover'
              />
            ) : (
              <User className='w-12 h-12' />
            )}
          </div>
          {isEditing && (
            <label className='absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-colors cursor-pointer'>
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleImageUpload}
              />
              <Edit className='w-4 h-4' />
            </label>
          )}
        </div>

        {/* Form Fields */}
        <div className='w-full space-y-4'>
          {/* Username Field */}
          <div className='relative'>
            <label className='block text-sm mb-1 text-gray-400'>Username</label>
            <div className='relative'>
              <input
                type='text'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className='w-full bg-gray-800 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50'
                placeholder='Enter username'
              />
              <User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
            </div>
          </div>

          {/* Email Field */}
          <div className='relative'>
            <label className='block text-sm mb-1 text-gray-400'>Email</label>
            <div className='relative'>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className='w-full bg-gray-800 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50'
                placeholder='Enter email'
              />
              <Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
            </div>
          </div>

          {/* Password Field - Always Disabled */}
          <div className='relative'>
            <label className='block text-sm mb-1 text-gray-400'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                disabled={true}
                className='w-full bg-gray-800 rounded px-10 py-2 opacity-50'
                placeholder='Enter password'
              />
              <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4' />
              <button
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 w-4 h-4'
                onClick={() => setShowPassword(!showPassword)}
                disabled={!isEditing}
              >
                {showPassword ? (
                  <EyeOff className='w-4 h-4' />
                ) : (
                  <Eye className='w-4 h-4' />
                )}
              </button>
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              onClick={handleSubmit}
              className='w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-600 transition-colors mt-6 flex items-center justify-center gap-2'
            >
              <Check className='w-4 h-4' />
              Save Changes
            </button>
          )}
        </div>
      </div>
      <TypeStats />
    </div>
  );
};

export default Profile;
