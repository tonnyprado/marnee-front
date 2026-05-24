/**
 * BrainstormingPage
 * Página independiente de Brainstorming
 */

import React from "react";
import PageTransition from "../../Component/PageTransition";
import BrainstormingSection from "./Calendar/BrainstormingSection";

export default function BrainstormingPage() {
  return (
    <PageTransition className="flex min-h-screen bg-[#f6f6f6]">
      <div className="flex-1 p-8">
        <BrainstormingSection calendarId={null} />
      </div>
    </PageTransition>
  );
}
