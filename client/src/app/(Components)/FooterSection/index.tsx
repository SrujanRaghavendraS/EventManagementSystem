// components/FooterSection.js
import { Github, Linkedin, Phone } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer id="contact" className="py-16 bg-gray-900">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Created by Srujan Raghavendra S</h2>
        <p className="mt-4 text-lg text-gray-400">Feel free to connect!</p>
        <div className="mt-8 flex justify-center gap-6">
          <a
            href="https://github.com/your-github-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <Github size={30} />
          </a>
          <a
            href="https://www.linkedin.com/in/your-linkedin-profile"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            <Linkedin size={30} />
          </a>
          <a
            href="tel:+9110415398"
            className="text-gray-400 hover:text-white transition"
          >
            <Phone size={30} />
          </a>
        </div>
      </div>
    </footer>
  );
}
