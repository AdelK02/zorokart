// "use client";

// import "./globals.css";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export const metadata = {
//   title: "zorokart",
//   description: "Minimalistic eCommerce Platform",
// };

// export default function RootLayout({ children }) {
//   const router = useRouter();
//   const currentYear = new Date().getFullYear();
//   const [isAdmin, setIsAdmin] = useState(false);
//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     setIsAdmin(!!token);

//     // Keep navbar in sync if token changes
//     const syncAuth = () => {
//       setIsAdmin(!!localStorage.getItem("adminToken"));
//     };

//     window.addEventListener("storage", syncAuth);
//     return () => window.removeEventListener("storage", syncAuth);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     setIsAdmin(false);
//     router.push("/admin/login");
//   };

//   return (
//     <html lang="en">
//       <body>
//         <nav className="navbar">
//           <div className="logo">
//             <Link href="/">
//               <Image
//                 src="/images/logo.svg"
//                 alt="Logo"
//                 width={120}
//                 height={60}
//               />
//             </Link>
//           </div>
//           <div className="nav-links">
//             <Link href="/">Home</Link>
//             <Link href="/about">About</Link>
//             <Link href="/register">Register</Link>
//             <Link href="/admin/login">Login</Link>
//             {isAdmin ? (
//               <>
//                 <Link href="/admin/dashboard">Dashboard</Link>
//                 <button onClick={handleLogout} className="logout-btn">
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <Link href="/admin/login">Login</Link>
//             )}
//           </div>
//         </nav>
//         {children}
//         <footer>
//           <p>&copy; {currentYear} zorokart. Built with 💕.</p>
//         </footer>
//       </body>
//     </html>
//   );
// }



import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "@fortawesome/fontawesome-svg-core/styles.css"; // Import the CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import WhatsappFloat from "./WhatsappFloat";
config.autoAddCss = false;

export const metadata = {
  title: "zorokart",
  description: "Minimalistic eCommerce Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <WhatsappFloat />
        <Footer />
      </body>
    </html>
  );
}
