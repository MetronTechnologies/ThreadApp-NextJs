import {OurFileRouter} from "@/api/uploadthing/core";
import {generateReactHelpers} from "@uploadthing/react/hooks";


export const { useUploadThing, uploadFiles } =
    generateReactHelpers<OurFileRouter>();