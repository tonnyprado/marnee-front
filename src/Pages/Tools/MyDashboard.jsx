/**
 * MyDashboard Component
 * Dashboard principal con diseño premium e interactivo
 * Versión completamente nueva con componentes reutilizables
 */
import React from "react";
import PageTransition from "../../Component/PageTransition";
import ContentMarketingSection from "./MyDashboardSections/ContentMarketingSection";

export default function MyDashboard() {
  return (
    <PageTransition className="flex min-h-screen bg-[#f6f6f6]">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content Area with Premium Spacing */}
        <div className="flex-1 p-8">
          <ContentMarketingSection />
        </div>
      </div>
    </PageTransition>
  );
}
