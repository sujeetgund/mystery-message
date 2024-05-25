"use client";
import axios, { AxiosError } from "axios";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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

import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  //   Zod and React hook form implementation
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (
    data
  ) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/sign-in");
    } catch (error) {
      console.log("verify account error", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Error registering user",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col justify-center items-center">
      <div className="text-center my-6">
        <h1 className="font-extrabold text-3xl">Verify your Account</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full border p-12 shadow-xl bg-white rounded-2xl"
        >
          {/* Verification Code */}
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your code" type="text" {...field} />
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
        </form>
      </Form>
    </div>
  );
};

export default VerifyAccount;
