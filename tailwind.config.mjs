/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: [
	  "./app/**/*.{js,ts,jsx,tsx,mdx}",
	  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	  "./node_modules/@shadcn/ui/dist/**/*.js",
	  "./pages/**/*.{js,ts,jsx,tsx}",
	  "./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
	  extend: {
		fontSize: {
		  hero: "3.5rem",
		  title: "2rem",
		  subtitle: "1.5rem",
		  body: "1.2rem",
		},
		colors: {
		  primary: "#6366F1",
		  secondary: "#06B6D4",
		  blackBright: "#0D0D0D", 
		  blackGloss: "#121212",
		  dark: "#121826",
		  light: "#F8FAFD",
		  cardBg: {
			DEFAULT: "#FFFFFF",
			dark: "#1E2535", 
		  },						  
		  textPrimary: {
			DEFAULT: "#22272E",
			dark: "#F8FAFC", 
		  },
		  textSecondary: {
			DEFAULT: "#4B5563",
			dark: "#E5E7EB", 
		  },						  
		  inputBg: {
			DEFAULT: "#E3E6ED",
			dark: "#1E2535",
		  },
		  buttonBg: "#7C3AED",
		  buttonHover: "#5B21B6",
		  border: {
			DEFAULT: "#D1D5DB",
			dark: "#3E4451",
		  },
		  ring: {
			DEFAULT: "#5E81F4",
			dark: "#6366F1",
		  },
		},
		spacing: {
		  section: "10rem",
		},
		borderRadius: {
		  xl: "1rem",
		},
	  },
	},
	plugins: [],
  };
  