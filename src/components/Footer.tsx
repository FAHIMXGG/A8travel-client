"use client";

import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, Heart, Plane, MapPin, Users, Globe, Shield, HelpCircle, FileText } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Travel Plans", href: "/travelplan" },
    { name: "Find Travel Buddy", href: "/FindTravelBuddy" },
    { name: "About", href: "/about" },
  ];

  const resources = [
    { name: "How It Works", href: "/about" },
    { name: "Safety Guidelines", href: "/about" },
    { name: "Travel Tips", href: "/blog" },
    { name: "FAQ", href: "/about" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/about" },
    { name: "Terms of Service", href: "/about" },
    { name: "Community Guidelines", href: "/about" },
    { name: "Contact Us", href: "/about" },
  ];

  const socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Email", href: "mailto:contact@travelbuddy.com", icon: Mail },
  ];

  return (
    <footer className="relative mt-auto border-t border-white/10 bg-background/50 backdrop-blur-xl">
      {/* Gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-cyan-500/5" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <Link href="/" className="group inline-flex items-center gap-2">
              <div className="relative">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 opacity-75 blur-md transition-opacity group-hover:opacity-100" />
                <Plane className="relative h-6 w-6 text-amber-500" />
              </div>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-xl font-bold text-transparent">
                TravelBuddy
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Connect with fellow travelers, join exciting trips, and create unforgettable memories together. Your next adventure starts here.
            </p>
            <div className="flex items-center gap-4 pt-2">
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

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
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
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="h-4 w-4 text-cyan-500" />
              Resources
            </h3>
            <ul className="space-y-2">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyan-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              Legal
            </h3>
            <ul className="space-y-2">
              {legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-purple-500"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 border-t border-white/10 pt-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Shield className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Verified Travelers</h4>
              <p className="text-xs text-muted-foreground mt-1">Safe and secure community</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <Users className="h-5 w-5 text-cyan-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Active Community</h4>
              <p className="text-xs text-muted-foreground mt-1">Join thousands of travelers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Globe className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Global Destinations</h4>
              <p className="text-xs text-muted-foreground mt-1">Explore amazing places</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500/10 border border-orange-500/20">
              <Plane className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Easy Matching</h4>
              <p className="text-xs text-muted-foreground mt-1">Find your perfect travel buddy</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-white/10 pt-6 sm:mt-12 sm:pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-center text-sm text-muted-foreground">
              © {currentYear} TravelBuddy. All rights reserved.
            </p>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="h-4 w-4 fill-red-500 text-red-500" />{" "}
              for travelers worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
