"use client";

import { logoUrl } from "app/lib/constants";
import { toast } from "app/lib/toast";
import React from "react";
import { Img } from "../../components/Img";
import { useOutpostImageUpload } from "./useOutpostImageUpload";

interface OutpostImageUploaderProps {
  outpostId: string;
  currentImageUrl?: string;
  onImageUploaded?: (imageUrl: string) => void;
  className?: string;
}

/**
 * Component for uploading outpost images
 * Similar to how you would use the Flutter OutpostImageService
 */
export const OutpostImageUploader: React.FC<OutpostImageUploaderProps> = ({
  outpostId,
  currentImageUrl,
  onImageUploaded,
  className = "",
}) => {
  const { isUploading, pickAndUploadImage, downloadUrl } =
    useOutpostImageUpload();

  const handleImageUpload = async () => {
    if (isUploading) {
      toast.info("Upload already in progress");
      return;
    }
    const imageUrl = await pickAndUploadImage(outpostId);
    if (imageUrl && onImageUploaded) {
      onImageUploaded(imageUrl);
    }
  };

  return (
    <div className={`outpost-image-uploader ${className}`}>
      <div
        className="image-preview-container relative cursor-pointer"
        onClick={handleImageUpload}
      >
        <Img
          src={downloadUrl ?? currentImageUrl ?? logoUrl}
          alt="Outpost image"
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />

        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <div className="text-sm">Uploading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
