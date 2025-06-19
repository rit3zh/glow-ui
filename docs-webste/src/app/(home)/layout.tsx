import type { ReactNode } from "react";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/app/layout.config";
import Logo from "../../../static/media/logo_.svg";
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";
import {
  Github,
  Coffee,
  BookOpen,
  Zap,
  Users,
  MessageCircle,
  Star,
} from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          type: "custom",
          on: "nav",
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>
                <BookOpen className="w-4 h-4 mr-2" />
                Documentation
              </NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink href="/docs">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <div>
                      <span className="text-sm font-medium">
                        Getting Started
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Quick start guide
                      </p>
                    </div>
                  </div>
                </NavbarMenuLink>

                <NavbarMenuLink href="https://github.com/rit3zh/glow-ui/tree/main/app/components">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    <div>
                      <span className="text-sm font-medium">Examples</span>
                      <p className="text-xs text-muted-foreground">
                        Live examples & demos
                      </p>
                    </div>
                  </div>
                </NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
        {
          type: "custom",
          on: "nav",
          children: (
            <NavbarMenu>
              <NavbarMenuTrigger>
                <Users className="w-4 h-4 mr-2" />
                Community
              </NavbarMenuTrigger>
              <NavbarMenuContent>
                <NavbarMenuLink
                  href="http://discordapp.com/users/755101874268536893"
                  external
                >
                  <div className="flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <div>
                      <span className="text-sm font-medium">Discord</span>
                      <p className="text-xs text-muted-foreground">
                        Connect with the developer!
                      </p>
                    </div>
                  </div>
                </NavbarMenuLink>
              </NavbarMenuContent>
            </NavbarMenu>
          ),
        },
        {
          text: "Changelog",
          url: "/changelog",
          active: "nested-url",
        },
        {
          type: "custom",
          on: "nav",
          children: (
            <a
              href="https://github.com/rit3zh/glow-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          ),
        },
        {
          type: "custom",
          on: "nav",
          children: (
            <a
              href="https://buymeacoffee.com/rit3zh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
              aria-label="Buy me a coffee"
            >
              <Coffee className="w-4 h-4" />
            </a>
          ),
        },
      ]}
      // Add mobile menu items for better mobile experience
      nav={{
        title: (
          <img
            src={"/static/media/logo_.svg"}
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
        ),
        url: "/",
      }}
    >
      {children}
    </HomeLayout>
  );
}
