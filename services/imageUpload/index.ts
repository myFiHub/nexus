import { getFirebaseStorage, isFirebaseConfigured } from "app/lib/firebase";
import { toast } from "app/lib/toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface OutpostImageServiceOptions {
  maxFileSize?: number; // in bytes, default 2MB
  allowedTypes?: string[]; // default ['image/jpeg', 'image/png', 'image/webp']
}

export class OutpostImageService {
  private maxFileSize: number;
  private allowedTypes: string[];
  private isUploadingImage: boolean = false;

  constructor(options: OutpostImageServiceOptions = {}) {
    this.maxFileSize = options.maxFileSize || 2 * 1024 * 1024; // 2MB default
    this.allowedTypes = options.allowedTypes || [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
  }

  /**
   * Pick an image file from the user's device
   * @returns Promise<File | null> - The selected file or null if cancelled/failed
   */
  async pickImage(): Promise<File | null> {
    try {
      // Create a file input element
      const input = document.createElement("input");
      input.type = "file";
      input.accept = this.allowedTypes.join(",");
      input.style.display = "none";

      // Create a promise to handle file selection
      const filePromise = new Promise<File | null>((resolve) => {
        input.onchange = (event) => {
          const target = event.target as HTMLInputElement;
          const file = target.files?.[0] || null;
          resolve(file);
        };
      });

      // Trigger file selection
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);

      const file = await filePromise;

      if (!file) {
        console.warn("No image selected.");
        return null;
      }

      // Validate file type
      if (!this.allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type. Allowed types: ${this.allowedTypes.join(", ")}`
        );
        return null;
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        toast.error(
          `Image size must be less than ${this.maxFileSize / (1024 * 1024)}MB`
        );
        return null;
      }

      return file;
    } catch (error) {
      console.error("Error picking image:", error);
      toast.error("Failed to pick image.");
      return null;
    }
  }

  /**
   * Upload a file to Firebase Storage
   * @param file - The file to upload
   * @param outpostId - The outpost ID for the storage path
   * @param onUploadStart - Callback when upload starts
   * @param onUploadComplete - Callback when upload completes
   * @returns Promise<string | null> - The download URL or null if failed
   */
  async uploadImage(
    file: File,
    outpostId: string,
    onUploadStart?: () => void,
    onUploadComplete?: (url: string | null) => void
  ): Promise<string | null> {
    if (this.isUploadingImage) {
      toast.error("Upload already in progress");
      return null;
    }

    this.isUploadingImage = true;
    onUploadStart?.();

    try {
      // Validate file type
      if (!this.allowedTypes.includes(file.type)) {
        toast.error(
          `Invalid file type. Allowed types: ${this.allowedTypes.join(", ")}`
        );
        return null;
      }

      // Check file size
      if (file.size > this.maxFileSize) {
        toast.error(
          `Image size must be less than ${this.maxFileSize / (1024 * 1024)}MB`
        );
        return null;
      }

      // Upload to Firebase Storage
      const downloadUrl = await this.uploadToFirebaseStorage(file, outpostId);

      if (downloadUrl) {
        toast.success("Image uploaded successfully");
        onUploadComplete?.(downloadUrl);
        return downloadUrl;
      }

      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image.");
      onUploadComplete?.(null);
      return null;
    } finally {
      this.isUploadingImage = false;
    }
  }

  /**
   * Pick and upload an image for an outpost (combination of pickImage and uploadImage)
   * @param outpostId - The ID of the outpost
   * @param onUploadStart - Callback when upload starts
   * @param onUploadComplete - Callback when upload completes
   * @returns Promise<string | null> - The uploaded image URL or null if failed
   */
  async pickAndUploadImage(
    outpostId: string,
    onUploadStart?: () => void,
    onUploadComplete?: (url: string | null) => void
  ): Promise<string | null> {
    // Pick the image first
    const file = await this.pickImage();

    if (!file) {
      return null;
    }

    // Upload the picked image
    return await this.uploadImage(
      file,
      outpostId,
      onUploadStart,
      onUploadComplete
    );
  }

  /**
   * Upload file to Firebase Storage
   * @param file - The file to upload
   * @param outpostId - The outpost ID for the storage path
   * @returns Promise<string | null> - The download URL or null if failed
   */
  private async uploadToFirebaseStorage(
    file: File,
    outpostId: string
  ): Promise<string | null> {
    try {
      // Check if Firebase is configured
      if (!isFirebaseConfigured()) {
        toast.error(
          "Firebase is not configured. Please add your Firebase configuration."
        );
        return null;
      }

      const storage = getFirebaseStorage();
      if (!storage) {
        toast.error(
          "Firebase Storage is not available. Please check your Firebase configuration."
        );
        return null;
      }

      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileExtension = file.name.split(".").pop();
      const fileName = `outpost_${outpostId}_${timestamp}.${fileExtension}`;

      //   Create storage reference
      const storageRef = ref(storage, `outposts/${outpostId}/${fileName}`);

      // Upload the file
      const uploadResult = await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadUrl = await getDownloadURL(uploadResult.ref);

      // For now, return a mock URL until Firebase is properly configured
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading to Firebase Storage:", error);
      toast.error("Failed to upload image to storage.");
      return null;
    }
  }

  /**
   * Get the current upload status
   * @returns boolean - Whether an upload is currently in progress
   */
  getUploadStatus(): boolean {
    return this.isUploadingImage;
  }

  /**
   * Reset the upload status (useful for error recovery)
   */
  resetUploadStatus(): void {
    this.isUploadingImage = false;
  }
}

// Export a singleton instance
export const outpostImageService = new OutpostImageService();
