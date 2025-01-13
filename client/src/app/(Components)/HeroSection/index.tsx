export default function HeroSection() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white">
          EventEase: Simplify Event Management
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200">
          Empowering IT sectors with efficient tools to plan, organize, and manage events effortlessly.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="#features"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition"
          >
            Learn More
          </a>
          <a
            href="/login"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Login
          </a>
        </div>
      </div>
    </header>
  );
}
