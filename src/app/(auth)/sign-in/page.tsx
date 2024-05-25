"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import Link from "next/link";

const SignInPage = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zod and React hook form implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Handle Submit
  const onSubmit: SubmitHandler<z.infer<typeof signInSchema>> = async (
    data
  ) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      console.log("Credentials login failed");

      toast({
        title: "Error",
        description: result?.error,
        variant: "destructive",
      });
    }

    if (result?.ok) {
      toast({
        title: "Success",
        description: "user logged in successfully.",
      });

      router.replace("/dashboard");
    }
    setIsSubmitting(false);

    console.log(result);
  };
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center my-6">
        <h1 className="font-extrabold text-3xl">Login to your Account</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full border rounded-2xl p-12 shadow-xl bg-white"
        >
          {/* Identifier */}
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username or Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username or email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>

          <p>
            New here?{" "}
            <Link href="/sign-up" className="text-blue-700">
              Create new account
            </Link>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default SignInPage;
