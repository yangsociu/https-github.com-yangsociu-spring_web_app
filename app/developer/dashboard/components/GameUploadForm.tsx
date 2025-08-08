// Component biểu mẫu để tải lên trò chơi mới, cho phép nhập thông tin trò chơi, 
// tải lên hình ảnh xem trước, cung cấp liên kết tải xuống APK, và gửi dữ liệu để phê duyệt, 
// với thông báo kết quả và xử lý lỗi.

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { createGame } from "@/lib/api";
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type FormData = {
  name: string;
  description: string;
  requirements: string;
  previewImage: FileList;
  apkFileUrl: string;
  supportLeaderboard: boolean;
  supportPoints: boolean;
};

export function GameUploadForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("requirements", data.requirements);
    formData.append("previewImage", data.previewImage[0]);
    formData.append("apkFileUrl", data.apkFileUrl);
    formData.append("supportLeaderboard", String(data.supportLeaderboard));
    formData.append("supportPoints", String(data.supportPoints));

    try {
      await createGame(formData);
      toast({
        title: "Game Submitted!",
        description: "Your game has been submitted for approval.",
      });
      reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
      <Card className="mx-auto max-w-2xl w-full bg-white border-gray-200 shadow-lg rounded-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">Upload New Game</CardTitle>
          <CardDescription className="text-gray-600 text-base mt-1">
            Submit your game details for approval
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-gray-800 text-sm font-semibold">Game Name</Label>
              <Input
                id="name"
                placeholder="Enter game name"
                {...register("name", { required: "Game name is required" })}
                className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
              />
              {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-gray-800 text-sm font-semibold">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your game"
                {...register("description", { required: "Description is required" })}
                className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg"
              />
              {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="requirements" className="text-gray-800 text-sm font-semibold">System Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="Specify system requirements"
                {...register("requirements", { required: "System requirements are required" })}
                className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg"
              />
              {errors.requirements && <p className="text-sm text-red-600">{errors.requirements.message}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="previewImage" className="text-gray-800 text-sm font-semibold">Preview Image (PNG, JPG)</Label>
                <Input
                  id="previewImage"
                  type="file"
                  accept="image/png, image/jpeg"
                  {...register("previewImage", { required: "Preview image is required" })}
                  className="border-gray-200 bg-white text-gray-800 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                />
                {errors.previewImage && <p className="text-sm text-red-600">{errors.previewImage.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apkFileUrl" className="text-gray-800 text-sm font-semibold">Game Download Link</Label>
                <Input
                  id="apkFileUrl"
                  type="url"
                  placeholder="https://example.com/game.apk"
                  {...register("apkFileUrl", { required: "Download link is required" })}
                  className="border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 rounded-lg h-11 focus:ring-2 focus:ring-blue-600 transition-all duration-200"
                />
                {errors.apkFileUrl && <p className="text-sm text-red-600">{errors.apkFileUrl.message}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="supportLeaderboard" {...register("supportLeaderboard")} />
                <Label htmlFor="supportLeaderboard" className="text-gray-800 text-sm font-semibold">Support Leaderboard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="supportPoints" {...register("supportPoints")} />
                <Label htmlFor="supportPoints" className="text-gray-800 text-sm font-semibold">Support Points</Label>
              </div>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Approval
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}