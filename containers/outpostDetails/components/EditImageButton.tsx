"use client";

import { Button } from "app/components/Button";
import { GlobalSelectors } from "app/containers/global/selectors";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { OutpostModel } from "app/services/api/types";
import { outpostImageService } from "app/services/imageUpload";
import { revalidateService } from "app/services/revalidate";
import { ReduxProvider } from "app/store/Provider";
import { Edit, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { outpostDetailsActions } from "../slice";

interface EditImageButtonProps {
  outpost: OutpostModel;
  className?: string;
}

const Content = ({ outpost, className }: EditImageButtonProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const myUser = useSelector(GlobalSelectors.podiumUserInfo);
  const [isUploading, setIsUploading] = useState(false);

  if (!myUser) return null;
  const amIAdmin = myUser?.uuid === outpost.creator_user_uuid;
  const handleEditImage = async () => {
    try {
      const pickedImage = await outpostImageService.pickImage();
      if (!pickedImage) {
        return;
      }
      setIsUploading(true);
      const uploadedImageUrl = await outpostImageService.uploadImage(
        pickedImage,
        outpost.uuid
      );
      if (!uploadedImageUrl) {
        return;
      }
      const updatedOutpost = await podiumApi.updateOutpost({
        uuid: outpost.uuid,
        image: uploadedImageUrl,
      });
      if (!updatedOutpost) {
        toast.error("Failed to update outpost image");
        setIsUploading(false);
      } else {
        dispatch(
          outpostDetailsActions.setOutpost({
            ...outpost,
            image: uploadedImageUrl,
          })
        );
        await revalidateService.revalidateMultiple({
          outpostId: outpost.uuid,
          allOutposts: true,
        });
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update outpost image");
    } finally {
      setIsUploading(false);
    }
  };
  if (!amIAdmin) return null;

  return (
    <Button
      size="md"
      variant="ghost"
      className={`absolute bottom-4 right-4 z-10 cursor-pointer ${
        className || ""
      }`}
      onClick={handleEditImage}
      disabled={isUploading}
    >
      {isUploading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Edit className="w-6 h-6" />
      )}
    </Button>
  );
};

export const EditImageButton = ({
  outpost,
  className,
}: EditImageButtonProps) => {
  return (
    <ReduxProvider>
      <Content outpost={outpost} className={className} />
    </ReduxProvider>
  );
};
