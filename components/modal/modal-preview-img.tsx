import React from "react";
import {
  MorphingDialog,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogImage,
  MorphingDialogTrigger,
} from "@/components/ui/morphing-dialog";
import { XIcon } from "lucide-react";
import { MorphingDialogClose } from "../ui/morphing-dialog";

interface ModalPreviewImgProps {
  src: string;
  alt: string;
  className?: string;
  thumbnailSize?: {
    width?: number | string;
    height?: number | string;
  };
  previewSize?: {
    width?: number | string;
    height?: number | string;
  };
  thumbnailClassName?: string;
  previewClassName?: string;
}

export default function ModalPreviewImg({
  src,
  alt,
  className,
  thumbnailSize = { width: 32, height: 32 },
  previewSize = { width: "90vw", height: "90vh" },
  thumbnailClassName = "",
  previewClassName = "",
}: ModalPreviewImgProps) {
  return (
    <>
      <MorphingDialog
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        <MorphingDialogTrigger>
          <MorphingDialogImage
            src={src}
            alt={alt}
            className={`rounded-[4px] ${thumbnailClassName}`}
            style={{
              width: thumbnailSize?.width,
              height: thumbnailSize?.height,
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />
        </MorphingDialogTrigger>
        <MorphingDialogContainer className="relative flex items-center justify-center rounded-[4px]">
          <MorphingDialogContent className="relative flex items-center justify-center rounded-[4px]">
            <div className="relative sm:w-1/3 lg:w-1/2 xl:w-1/2  aspect-square">
              <MorphingDialogImage
                src={src}
                alt={alt}
                className={`rounded-[4px] object-cover max-w-full max-h-full ${previewClassName}`}
                style={{
                  width: previewSize?.width,
                  height: previewSize?.height,
                  objectFit: "contain",
                }}
              />
              {/* Tombol X dengan positioning yang tepat */}
              <MorphingDialogClose
                className="absolute right-10 sm:right-26 top-2 z-50 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm p-1.5 shadow-lg hover:bg-white transition-colors"
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: {
                    opacity: 1,
                    scale: 1,
                    transition: { delay: 0.3, duration: 0.2 },
                  },
                  exit: {
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.1 },
                  },
                }}
              >
                <XIcon className="h-full w-full text-zinc-600" />
              </MorphingDialogClose>
            </div>
          </MorphingDialogContent>
        </MorphingDialogContainer>
      </MorphingDialog>
    </>
  );
}
