import { Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 ">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6">
          <a
            href="https://github.com/pettiboy/decide-frontend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <Github className="w-5 h-5" />
            <span>Frontend</span>
          </a>
          <a
            href="https://github.com/pettiboy/decide-backend"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <Github className="w-5 h-5" />
            <span>Backend</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
