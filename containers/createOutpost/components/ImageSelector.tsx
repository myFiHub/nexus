"use client";
import { useOutpostImageUpload } from "app/services/imageUpload/useOutpostImageUpload";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../components/Button";
import { logoUrl } from "../../../lib/constants";
import { createOutpostSelectors } from "../selectors";
import { createOutpostActions } from "../slice";

const ImageSelector = () => {
  const dispatch = useDispatch();
  const selectedImage = useSelector(createOutpostSelectors.image);
  const { pickImage } = useOutpostImageUpload();

  const handleImagePick = async () => {
    const file = await pickImage();
    if (file) {
      dispatch(createOutpostActions.setSelectedImage(file));
    }
  };

  // Simple approach - just use the file directly if it exists
  const imageSrc =
    selectedImage instanceof File
      ? URL.createObjectURL(selectedImage)
      : logoUrl;

  return (
    <div className="mb-8 flex flex-col items-center gap-4">
      {/* Image Preview */}
      <div className="relative h-48 w-48 overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center">
        <Image
          src={imageSrc}
          alt="Outpost image"
          width={192}
          height={192}
          className="h-full w-full object-cover"
          unoptimized={imageSrc.startsWith("blob:")}
        />
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleImagePick}
        variant="outline"
        size="md"
        className="min-w-[140px]"
      >
        Choose Image
      </Button>

      {/* Help text */}
      <p className="text-center text-sm text-gray-500 m-0">
        Select an image for your outpost. Recommended size: 400x400px
      </p>
    </div>
  );
};

export default ImageSelector;
