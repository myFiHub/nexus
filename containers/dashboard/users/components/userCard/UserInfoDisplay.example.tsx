"use client";

import { User } from "app/services/api/types";
import { UserInfoDisplay } from "./UserInfoDisplay";

// Sample user data for demonstration
const sampleUser: User = {
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
  aptos_address: "0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b6",
  name: "Alice Johnson",
  image:
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  email: "alice@example.com",
  login_type: "google",
  login_type_identifier: "google_123456",
  is_over_18: true,
  referrals_count: 5,
  remaining_referrals_count: 3,
  received_boo_amount: 0,
  received_boo_count: 0,
  received_cheer_amount: 150,
  received_cheer_count: 3,
  sent_boo_amount: 0,
  sent_boo_count: 0,
  sent_cheer_amount: 200,
  sent_cheer_count: 4,
  followers_count: 42,
  followings_count: 18,
  followed_by_me: false,
  accounts: [
    {
      uuid: "acc-123",
      address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
      aptos_address: "0x742d35cc6634c0532925a3b8d4c9db96c4b4d8b6",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      is_primary: true,
      login_type: "google",
      login_type_identifier: "google_123456",
    },
  ],
};

const sampleUser2: User = {
  uuid: "456e7890-e89b-12d3-a456-426614174001",
  address: "0x8ba1f109551bD432803012645Hac136c772c3",
  aptos_address: "0x8ba1f109551bd432803012645hac136c772c3",
  name: "Bob Smith",
  image: undefined, // Will use default logo
  email: "bob@example.com",
  login_type: "twitter",
  login_type_identifier: "twitter_789012",
  is_over_18: true,
  referrals_count: 12,
  remaining_referrals_count: 0,
  received_boo_amount: 50,
  received_boo_count: 1,
  received_cheer_amount: 300,
  received_cheer_count: 6,
  sent_boo_amount: 25,
  sent_boo_count: 1,
  sent_cheer_amount: 150,
  sent_cheer_count: 3,
  followers_count: 89,
  followings_count: 23,
  followed_by_me: true,
  accounts: [
    {
      uuid: "acc-456",
      address: "0x8ba1f109551bD432803012645Hac136c772c3",
      aptos_address: "0x8ba1f109551bd432803012645hac136c772c3",
      image: undefined,
      is_primary: true,
      login_type: "twitter",
      login_type_identifier: "twitter_789012",
    },
  ],
};

export const UserInfoDisplayExample = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-6">
        UserInfoDisplay Component Examples
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Buy action example */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700">Buy Action</h3>
          <UserInfoDisplay
            user={sampleUser}
            actionType="buy"
            className="max-w-sm"
          />
        </div>

        {/* Sell action example */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-700">Sell Action</h3>
          <UserInfoDisplay
            user={sampleUser}
            actionType="sell"
            className="max-w-sm"
          />
        </div>

        {/* User without image */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-700">
            User Without Image
          </h3>
          <UserInfoDisplay
            user={sampleUser2}
            actionType="buy"
            className="max-w-sm"
          />
        </div>

        {/* Anonymous user */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-purple-700">
            Anonymous User
          </h3>
          <UserInfoDisplay
            user={{
              ...sampleUser,
              name: undefined,
            }}
            actionType="sell"
            className="max-w-sm"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Component Features:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Beautiful gradient background with animated elements</li>
          <li>• Smooth framer-motion animations for all elements</li>
          <li>
            • Action-specific color coding (green for buy, orange for sell)
          </li>
          <li>• User avatar with hover effects</li>
          <li>• Truncated wallet address display</li>
          <li>• Responsive design that works on all screen sizes</li>
          <li>• Fallback to default logo when user has no image</li>
          <li>• Graceful handling of missing user data</li>
        </ul>
      </div>
    </div>
  );
};
