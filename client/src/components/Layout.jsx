import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatBot from './ChatBot';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative">
      {/* 3D Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,255,0.2),transparent_50%)]"></div>
      
      <Header />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Layout; 