"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, Shield, Info } from "lucide-react";

interface PhoneNumberPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PhoneNumberPopup({ isOpen, onClose }: PhoneNumberPopupProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: `+251${phoneNumber}` }),
      });

      if (!response.ok) {
        throw new Error("Failed to update phone number");
      }

      toast({
        title: "Success",
        description: "Phone number updated successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update phone number",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#5B8F2D]/10 rounded-full flex items-center justify-center mb-4">
            <Phone className="w-10 h-10 text-[#5B8F2D]" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#5B8F2D]">Add Your Phone Number</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 mt-2 mb-6">
            We need your phone number to enhance your experience and keep you updated.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 h-12 border rounded-md bg-gray-50">
                <span className="text-xl">🇪🇹</span>
                <span className="text-gray-600">+251</span>
              </div>
              <Input
                id="phone"
                placeholder="9XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => {
                  // Only allow numbers and limit to 9 digits
                  const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                  setPhoneNumber(value);
                }}
                disabled={isLoading}
                className="h-12 text-lg flex-1"
              />
            </div>
            <p className="text-xs text-gray-500 pl-1">Enter your 9-digit phone number</p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
            <Info className="w-5 h-5 text-[#5B8F2D] mt-0.5" />
            <p className="text-sm text-gray-600">
              Your phone number will be used for important updates and notifications. We never share your information with third parties.
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="w-full h-12 text-lg bg-[#5B8F2D] hover:bg-[#5B8F2D]/90"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Save Phone Number</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 