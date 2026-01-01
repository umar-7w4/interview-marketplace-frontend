import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaLinkedin,
  FaXTwitter,
  FaInstagram,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className=" bg-dark text-white border-t border-gray-700 py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-8">
        {/* Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 text-lg">
          {/* Products */}
          <div>
            <h3 className="text-xl font-semibold text-textPrimary mb-4">
              <span className="text-primary font-bold">PRODUCTS</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary">
                  Screen
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Interview
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Engage
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  SkillUp
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Certified Assessments
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Plagiarism Detection
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Real World Questions
                </Link>
              </li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-xl font-semibold text-textPrimary mb-4">
              <span className="text-primary font-bold">SOLUTIONS</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary">
                  Set Up a Skills Strategy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Showcase Your Talent Brand
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Optimize Your Hiring Process
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Mobilize Your Internal Talent
                </Link>
              </li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-xl font-semibold text-textPrimary mb-4">
              <span className="text-primary font-bold">RESOURCES</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Customer Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Roles Directory
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  What’s New
                </Link>
              </li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-xl font-semibold text-textPrimary mb-4">
              <span className="text-primary font-bold">ABOUT US</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Newsroom
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Status
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Trust
                </Link>
              </li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-xl font-semibold text-textPrimary mb-4">
              <span className="text-primary font-bold">GET STARTED</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Free Trial
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Request Demo
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Product Support
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  For Developers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {}
        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Social Icons */}
          <div className="flex space-x-6">
            <Link
              href="#"
              className="text-white hover:text-primary transition-all text-2xl text-textSecondary hover:text-primary"
            >
              <FaFacebook />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-primary transition-all text-2xl text-textSecondary hover:text-primary"
            >
              <FaLinkedin />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-primary transition-all text-2xl text-textSecondary hover:text-primary"
            >
              <FaXTwitter />
            </Link>
            <Link
              href="#"
              className="text-white hover:text-primary transition-all text-2xl text-textSecondary hover:text-primary"
            >
              <FaInstagram />
            </Link>
          </div>

          {}
          <p className="text-white hover:text-primary transition-all mt-6 md:mt-0">
            © 2025 MockXpert. All Rights Reserved.
          </p>

          {}
          <Link
            href="#"
            className="text-white hover:text-primary transition-all hover:text-primary"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
