import React from 'react';
import { Outlet } from 'react-router-dom';
import { AccessibilityBar } from '../components/layout/AccessibilityBar';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-200">
      <AccessibilityBar />
      <Navbar />
      <main id="conteudo-principal" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
