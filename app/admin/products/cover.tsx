'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/kibo-ui/dropzone";
import { PRODUCT_COVER_BUCKET } from '@/lib/config'
import { Spinner } from '@/components/ui/spinner';

export default function ProductCover({
    uid,
    url,
    onUpload,
}: {
    uid: string | null
    url: string | null
    onUpload: (url: string, path: string) => void
}) {
    const supabase = createClient()
    
    const [uploading, setUploading] = useState(false)

    const [files, setFiles] = useState<File[] | undefined>();
    const [filePreview, setFilePreview] = useState<string | undefined>();

    const handleDrop = async (files: File[]) => {

        setUploading(true)
        setFiles(files);
        if (files.length > 0) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (typeof e.target?.result === "string") {
                    setFilePreview(e.target?.result);
                }
            };
            reader.readAsDataURL(files[0]);
        }
        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `temp/${uid}-${crypto.randomUUID()}.${fileExt}`;
        console.log(file.size, file.type);

        const { error: uploadError } = await supabase
            .storage
            .from(PRODUCT_COVER_BUCKET)
            .upload(filePath, file, {
                contentType: file.type, upsert: true
            });

        if (uploadError) {
            console.error(uploadError);
            alert('Something went wrong during upload');
            return;
        }

        const { data } = supabase
            .storage
            .from(PRODUCT_COVER_BUCKET)
            .getPublicUrl(filePath);

        onUpload(data.publicUrl, filePath);
        setUploading(false)
    };

    return (
            <Dropzone
                accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                onError={console.error}
                maxFiles={1}
                src={files}
                onDrop={handleDrop}
                className='relative aspect-[16/7]'
            >
                <DropzoneEmptyState />
                <DropzoneContent >
                    {uploading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        filePreview && (
                            <Image
                                src={filePreview}
                                alt="Preview"
                                className="object-cover"
                                fill
                        />
                    ))}      
                </DropzoneContent>
                {url && !filePreview && (
                        <Image
                            src={url}
                            alt="Current Cover"
                            className="object-cover"
                            fill
                        />
                    )}
            </Dropzone>
    )
}