"use client";

import { Heart, MessageCircle, Star } from "lucide-react";
import { Button } from "../Button";
import { loginPromptDialog } from "./loginPromptDialog";

export const LoginPromptDialogExample = () => {
  const handleLikeAction = async () => {
    const result = await loginPromptDialog({
      actionDescription: "like this post",
      additionalComponent: (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Heart className="w-4 h-4 text-red-500" />
          <span>Show your appreciation with a like!</span>
        </div>
      ),
      action: async () => {
        // This function will be called after successful login
        console.log("User liked the post!");
        // You can perform any action here that requires authentication
        // For example: API call to like a post, follow a user, etc.
      },
    });

    if (result.loggedIn) {
      console.log("User successfully logged in and action completed!");
    } else {
      console.log("User cancelled the login process");
    }
  };

  const handleCommentAction = async () => {
    const result = await loginPromptDialog({
      actionDescription: "leave a comment",
      additionalComponent: (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageCircle className="w-4 h-4 text-blue-500" />
          <span>Join the conversation!</span>
        </div>
      ),
      action: async () => {
        console.log("User can now comment!");
        // Open comment form, etc.
      },
    });

    if (result.loggedIn) {
      console.log("User logged in and can comment!");
    }
  };

  const handleFollowAction = async () => {
    const result = await loginPromptDialog({
      actionDescription: "follow this user",
      action: async () => {
        console.log("User can now follow!");
        // API call to follow user
      },
    });

    if (result.loggedIn) {
      console.log("User logged in and can follow!");
    }
  };

  const handlePremiumAction = async () => {
    const result = await loginPromptDialog({
      actionDescription: "access premium features",
      additionalComponent: (
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-medium text-yellow-800">Premium Feature</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Unlock exclusive content and advanced features
          </p>
        </div>
      ),
      action: async () => {
        console.log("User can now access premium features!");
        // Redirect to premium features or upgrade flow
      },
    });

    if (result.loggedIn) {
      console.log("User logged in and can access premium features!");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Login Prompt Dialog Examples</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handleLikeAction}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Heart className="w-4 h-4" />
          Like Post
        </Button>

        <Button
          onClick={handleCommentAction}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          Leave Comment
        </Button>

        <Button
          onClick={handleFollowAction}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Star className="w-4 h-4" />
          Follow User
        </Button>

        <Button
          onClick={handlePremiumAction}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Star className="w-4 h-4 text-yellow-500" />
          Premium Features
        </Button>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <pre className="text-sm text-gray-700 overflow-x-auto">
          {`const result = await loginPromptDialog({
  actionDescription: "perform this action",
  additionalComponent: <YourCustomComponent />, // optional
  action: async () => {
    // This runs after successful login
    console.log("User is logged in!");
  },
});

if (result.loggedIn) {
  // User successfully logged in and action completed
} else {
  // User cancelled the login process
}`}
        </pre>
      </div>
    </div>
  );
};
