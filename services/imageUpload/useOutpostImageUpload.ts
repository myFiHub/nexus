import { useState } from "react";
import { outpostImageService } from "./index";

export interface UseOutpostImageUploadReturn {
  isUploading: boolean;
  pickAndUploadImage: (outpostId: string) => Promise<string | undefined>;
  pickImage: () => Promise<File | undefined>;
  resetUploadStatus: () => void;
  downloadUrl: string | undefined;
}

/**
 * React hook for outpost image upload functionality
 * @returns Object containing upload state and methods
 */
export const useOutpostImageUpload = (): UseOutpostImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | undefined>(undefined);

  const pickAndUploadImage = async (
    outpostId: string
  ): Promise<string | undefined> => {
    setIsUploading(true);

    try {
      const result = await outpostImageService.pickAndUploadImage(
        outpostId,
        () => setIsUploading(true),
        () => setIsUploading(false)
      );
      setDownloadUrl(result || undefined);
      return result || undefined;
    } catch (error) {
      console.error("Error in useOutpostImageUpload:", error);
      setIsUploading(false);
      return undefined;
    }
  };

  const pickImage = async (): Promise<File | undefined> => {
    try {
      const file = await outpostImageService.pickImage();
      return file || undefined;
    } catch (error) {
      console.error("Error picking image:", error);
      return undefined;
    }
  };

  const resetUploadStatus = () => {
    setIsUploading(false);
    outpostImageService.resetUploadStatus();
  };

  return {
    isUploading,
    downloadUrl,
    pickAndUploadImage,
    pickImage,
    resetUploadStatus,
  };
};
