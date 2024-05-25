"use client";

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

import axios, { AxiosError } from "axios";

import { useDebounceCallback } from "usehooks-ts";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";

function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);

  // Zod and React hook form implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-uniqueness?username=${username}`
          );

          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ??
              "Error checking unique username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit: SubmitHandler<z.infer<typeof signUpSchema>> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });

      setIsSubmitting(false);
      if (response.data.success) {
        router.replace(`/verify/${username}`);
      }
    } catch (error) {
      console.log("user registration error", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Error registering user",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center my-6">
        <h1 className="font-extrabold text-3xl">Join Mystery Message</h1>
        <h3 className="font-medium text-lg">
          Sign up to start your anonymous journey.
        </h3>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full border p-12 shadow-xl bg-white rounded-2xl"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                </FormControl>
                {isCheckingUsername && (
                  <FormMessage>
                    <p className="flex text-green-500">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Checking username...
                    </p>
                  </FormMessage>
                )}
                {usernameMessage && (
                  <FormMessage
                    className={
                      usernameMessage == "username is unique"
                        ? "text-green-500"
                        : ""
                    }
                  >
                    {usernameMessage}
                  </FormMessage>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
            Already have an account? <Link href={"/sign-in"} className="text-blue-700">Sign In</Link>
          </p>
        </form>
      </Form>
    </div>
  );
}

export default SignUpPage;
