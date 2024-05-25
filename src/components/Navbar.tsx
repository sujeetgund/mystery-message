"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="fixed top-3 w-full">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image
              src={"/logo.png"}
              alt="Mystery Message"
              width={40}
              height={40}
              className="rounded-md cursor-pointer"
            />
          </Link>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            {session ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>{user.username}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[100px] gap-3 p-4 md:w-[125px] lg:w-[150px] z-10">
                    <li>
                      <NavigationMenuLink>
                        <Link
                          href={"/dashboard"}
                          className="text-sm font-medium leading-none"
                        >
                          Dashboard
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink>
                        <Link
                          href={""}
                          onClick={() => signOut()}
                          className="text-sm font-medium leading-none"
                        >
                          Log Out
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link href="/sign-in" className={navigationMenuTriggerStyle()}>
                  Sign In
                </Link>
              </NavigationMenuItem>
            )}
            <NavigationMenuItem></NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
};

export default Navbar;
