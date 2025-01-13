// components/FeatureSection.js
import { User, Calendar, CheckCircle } from 'lucide-react';

export default function FeatureSection() {
  return (
    <section id="features" className="py-16 bg-gray-800">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Get Started in 3 Simple Steps</h2>
        <p className="mt-4 text-lg text-gray-300">
          Organize your events effortlessly with these easy steps.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition">
            <User size={60} className="mx-auto text-green-500" />
            <h3 className="mt-4 text-xl font-semibold">Login or Create Account</h3>
            <p className="mt-2 text-gray-300">
              Sign up to access the platform or log in if you already have an account.
            </p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition">
            <Calendar size={60} className="mx-auto text-teal-500" />
            <h3 className="mt-4 text-xl font-semibold">Create Events</h3>
            <p className="mt-2 text-gray-300">
              Plan your event by providing all the necessary details and requirements.
            </p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg hover:shadow-xl transition">
            <CheckCircle size={60} className="mx-auto text-purple-500" />
            <h3 className="mt-4 text-xl font-semibold">Divide Tasks and Manage</h3>
            <p className="mt-2 text-gray-300">
              Assign tasks, set deadlines, and monitor progress in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
