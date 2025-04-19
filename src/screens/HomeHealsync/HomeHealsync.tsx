import React from "react";
import { DashboardSection } from "./sections/DashboardSection/DashboardSection";
import { FooterSection } from "./sections/FooterSection/FooterSection";
import { MainContainerSection } from "./sections/MainContainerSection";
import { NavigationSection } from "./sections/NavigationSection";

export const HomeHealsync = (): JSX.Element => {
  return (
    <main className="flex flex-col min-h-screen w-full bg-gray-100">
      <NavigationSection />
      <DashboardSection />
      <FooterSection />
      <MainContainerSection />
    </main>
  );
};
