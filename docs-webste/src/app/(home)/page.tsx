"use client";
import * as React from "react";
import { TextGenerateEffect } from "@/components/text-generate-effect";
import { buttonVariants } from "@/components/button";
import { FlipWords } from "@/components/flip-words";
import { Icons } from "@/components/icons";
import { cn } from "@/utils";
import {
  PageHeader,
  PageActions,
  PageHeaderHeading,
  PageHeaderDescription,
} from "@/components/page-header";
import Link from "next/link";
import {
  Download,
  Star,
  Zap,
  Palette,
  Layers,
  Code,
  Sparkles,
  ArrowRight,
  Play,
  BookOpen,
  Users,
  Heart,
} from "lucide-react";

export const dynamicParams = true;

// 3D Floating Elements Component
const FloatingElements: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20
              ${i % 4 === 0 ? "animate-pulse" : ""}
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `scale(${0.5 + Math.random() * 1.5})`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </>
  );
};

// Animated Grid Background
const GridBackground: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-black" />
    <div
      className="absolute inset-0 opacity-20"
      style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
      }}
    />
  </div>
);

// Feature Card Component
interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
}) => (
  <div className="group relative p-6 bg-black backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:border-zinc-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2">
    <div
      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
    />
    <div className="relative">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

// Stats Component
const StatsSection: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
    {[
      {
        icon: Download,
        label: "Downloads",
        value: "10K+",
        color: "text-green-400",
      },
      {
        icon: Star,
        label: "GitHub Stars",
        value: "2.5K+",
        color: "text-yellow-400",
      },
      {
        icon: Users,
        label: "Happy Developers",
        value: "500+",
        color: "text-blue-400",
      },
    ].map((stat, i) => (
      <div
        key={i}
        className="text-center p-6 bg-slate-800/60 backdrop-blur-sm rounded-xl border border-slate-700/50"
      >
        <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
        <div className="text-2xl font-bold text-slate-100">{stat.value}</div>
        <div className="text-sm text-slate-400">{stat.label}</div>
      </div>
    ))}
  </div>
);

export default function IndexPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <GridBackground />
      <FloatingElements />

      <div className="container relative z-10">
        <PageHeader>
          {/* Enhanced Hero Section */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <PageHeaderHeading>
            <div className="flex flex-col items-center">
              <FlipWords
                words={["React", "Native", "Glow"]}
                className="text-6xl md:text-9xl -z-10 bg-gradient-to-br from-slate-100 via-blue-300 to-purple-300 bg-clip-text text-transparent"
              />
              <div className="mt-4">
                <TextGenerateEffect
                  words="✨ glow with elegance"
                  className="md:text-4xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold"
                />
              </div>
            </div>
          </PageHeaderHeading>

          <PageHeaderDescription className="text-md text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8 mt-5">
            A premium collection of React Native components designed for modern
            applications. Create stunning interfaces with smooth animations and
            beautiful design systems.
          </PageHeaderDescription>

          <PageActions className="flex-wrap gap-3 sm:gap-4 mb-8">
            <Link
              href="/docs"
              className={cn(
                buttonVariants(),
                "group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
              )}
            >
              <Play className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              Get Started
            </Link>

            <Link
              target="_blank"
              rel="noreferrer"
              href="https://github.com/rit3zh/glow-ui"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "group border-slate-600 hover:border-blue-500 bg-slate-800/80 backdrop-blur-sm hover:bg-slate-700/80",
              )}
            >
              <Icons.gitHub className="mr-2 w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
              GitHub
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </PageActions>

          {/* Installation Command */}
        </PageHeader>

        {/* Stats Section */}
        {/* <StatsSection /> */}

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Why Choose Glow?
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Everything you need to build beautiful, accessible, and performant
              mobile applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Optimized components with smooth 60fps animations and minimal bundle size for peak performance."
              gradient="from-yellow-400 to-orange-500"
            />
            <FeatureCard
              icon={Palette}
              title="Customizable Themes"
              description="Built-in theming system with dark mode support and extensive customization options."
              gradient="from-pink-400 to-purple-500"
            />
            <FeatureCard
              icon={Layers}
              title="Modular Design"
              description="Import only what you need. Tree-shakeable components that keep your app bundle lean."
              gradient="from-blue-400 to-cyan-500"
            />
            <FeatureCard
              icon={BookOpen}
              title="Rich Documentation"
              description="Comprehensive guides, interactive examples, and API references to get you up and running quickly."
              gradient="from-green-400 to-teal-500"
            />
            <FeatureCard
              icon={Heart}
              title="Developer Experience"
              description="TypeScript support, excellent IntelliSense, and developer-friendly APIs that make coding a joy."
              gradient="from-red-400 to-pink-500"
            />
            <FeatureCard
              icon={Users}
              title="Community Driven"
              description="Built by developers, for developers. Join our growing community and contribute to the future."
              gradient="from-indigo-400 to-purple-500"
            />
          </div>
        </div>

        {/* CTA Section */}
        {/* <div className="text-center max-w-4xl mx-auto">
          <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl border border-slate-600/50 backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
              Ready to build something amazing?
            </h3>
            <p className="text-slate-400 mb-6">
              Join thousands of developers who are already building with Glow
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className={cn(
                  buttonVariants(),
                  "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
                )}
              >
                Start Building Now
              </Link>
              <Link
                href="/examples"
                className="px-6 py-3 text-slate-300 hover:text-blue-400 transition-colors duration-300"
              >
                View Examples →
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
