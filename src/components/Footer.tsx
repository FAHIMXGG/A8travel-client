"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Heart, Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: "Projects", href: "/projects" },
    { name: "About", href: "/about" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Email", href: "mailto:contact@example.com", icon: Mail },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-background/50 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-cyan-500/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-500 to-cyan-500 opacity-75 blur-md transition-opacity group-hover:opacity-100" />
                <Sparkles className="relative h-6 w-6 text-amber-500" />
              </div>
              <span className="bg-gradient-to-r from-amber-500 to-cyan-500 bg-clip-text text-xl font-bold text-transparent">
                Portify
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Building amazing web experiences with modern technologies.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-amber-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-cyan-500"
                >
                  Latest Posts
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted-foreground transition-colors hover:text-cyan-500"
                >
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground transition-colors hover:text-cyan-500"
                >
                  About Me
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    aria-label={social.name}
                  >
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-500/20 to-cyan-500/20 opacity-0 blur transition-opacity group-hover:opacity-100" />
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-background/50 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:border-amber-500/50">
                      <Icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-amber-500" />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-white/10 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © {currentYear} Portfolio. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" />{" "}
              using Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
