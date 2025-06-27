"use client";
import { useOutpostImageUpload } from "app/services/imageUpload/useOutpostImageUpload";
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
    <div
      style={{
        marginBottom: 32,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Image Preview */}
      <div
        style={{
          position: "relative",
          width: "200px",
          height: "200px",
          borderRadius: "12px",
          overflow: "hidden",
          border: "2px dashed #e5e7eb",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={imageSrc}
          alt="Outpost image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Upload Button */}
      <Button
        onClick={handleImagePick}
        variant="outline"
        size="md"
        style={{
          minWidth: "140px",
        }}
      >
        Choose Image
      </Button>

      {/* Help text */}
      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          textAlign: "center",
          margin: 0,
        }}
      >
        Select an image for your outpost. Recommended size: 400x400px
      </p>
    </div>
  );
};

export default ImageSelector;
