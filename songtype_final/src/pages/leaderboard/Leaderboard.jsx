import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, Loader } from "lucide-react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/typing/leaderboard",
      ); // Adjust the endpoint as per your API
      const data = await response.data;
      console.log(data);

      if (data.success) {
        setLeaderboardData(data.data);
      } else {
        setError("Failed to fetch leaderboard data");
      }
    } catch (error) {
      setError("Error connecting to the server");
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return <Trophy className='w-6 h-6 text-yellow-500' />;
      case 1:
        return <Medal className='w-6 h-6 text-gray-400' />;
      case 2:
        return <Medal className='w-6 h-6 text-amber-600' />;
      default:
        return <Award className='w-6 h-6 text-blue-500' />;
    }
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='flex items-center gap-2 text-blue-600'>
          <Loader className='w-6 h-6 animate-spin' />
          <span className='font-medium'>Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className=' text-red-600 px-4 py-3 rounded-lg'>
          <p className='font-medium'>{error}</p>
          <button
            onClick={fetchLeaderboardData}
            className='mt-2 text-sm text-red-700 hover:text-red-800 underline'
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen  py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden'>
          <div className='bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white'>
            <h1 className='text-3xl font-bold text-center mb-2'>
              Typing Speed Leaderboard
            </h1>
            <p className='text-blue-100 text-center'>
              Top performers ranked by WPM
            </p>
          </div>

          <div className='p-6'>
            {leaderboardData.length === 0 ? (
              <p className='text-center text-gray-500 py-8'>
                No leaderboard data available yet
              </p>
            ) : (
              <table className='w-full'>
                <thead>
                  <tr className='text-sm font-semibold text-gray-600 border-b border-gray-200'>
                    <th className='pb-4 text-left pl-4'>Rank</th>
                    <th className='pb-4 text-left'>Player</th>
                    <th className='pb-4 text-right'>Max WPM</th>
                    <th className='pb-4 text-right pr-4'>Avg. Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((player, index) => (
                    <tr
                      key={player._id}
                      className='hover:bg-gray-50 transition-colors'
                    >
                      <td className='py-4 pl-4'>
                        <div className='flex items-center gap-2'>
                          {getRankIcon(index)}
                          <span className='font-semibold'>{index + 1}</span>
                        </div>
                      </td>
                      <td className='py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold'>
                            {player.username[0].toUpperCase()}
                          </div>
                          <span className='font-medium text-gray-900'>
                            {player.username}
                          </span>
                        </div>
                      </td>
                      <td className='py-4 text-right font-semibold text-gray-900'>
                        {player.maxWPM}
                        <span className='text-gray-500 text-sm ml-1'>WPM</span>
                      </td>
                      <td className='py-4 pr-4 text-right'>
                        <div className='inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-medium'>
                          {player.avgAccuracy.toFixed(1)}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
