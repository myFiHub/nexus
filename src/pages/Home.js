import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-podium-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-podium-primary-text mb-4">
            Welcome to Podium Nexus
          </h1>
          <p className="text-xl text-podium-secondary-text mb-8">
            Your all-in-one platform for managing and tracking your achievements
          </p>
          <Link
            to="/dashboard"
            className="btn-primary px-8 py-3 text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-podium-primary-text text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-podium-primary-text mb-4">
              Achievement Tracking
            </h3>
            <p className="text-podium-secondary-text">
              Track and manage your achievements in one place. Set goals and monitor your progress.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-podium-primary-text mb-4">
              Analytics Dashboard
            </h3>
            <p className="text-podium-secondary-text">
              Get detailed insights into your performance with our comprehensive analytics dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card p-6">
            <h3 className="text-xl font-semibold text-podium-primary-text mb-4">
              Custom Profiles
            </h3>
            <p className="text-podium-secondary-text">
              Create and customize your profile to showcase your achievements and skills.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 