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
    bucket,
    onUpload,
}: {
    uid: string | null
    url: string | null
    bucket: string
    onUpload: (url: string, path: string) => void
}) {

    const supabase = createClient()
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState<string | undefined>();

    const handleDrop = async (files: File[]) => {

        setLoading(true)
        const file = files[0];
        const fileExt = file.name.split('.').pop();
        const filePath = `temp/${uid}-${crypto.randomUUID()}.${fileExt}`;
        console.log(file.size, file.type);
        const { error: uploadError } = await supabase
            .storage
            .from(bucket)
            .upload(filePath, file, {
                contentType: file.type, upsert: true
            });

        if (uploadError) {
            console.error(uploadError);
            alert('Something went wrong during upload');
            setLoading(false);
            return;
        }
        const { data } = supabase
            .storage
            .from(bucket)
            .getPublicUrl(filePath);

        onUpload(data.publicUrl, filePath);
        setPreview(data.publicUrl);
        setLoading(false)
    };

    return (
        <Dropzone
            accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
            onError={console.error}
            maxFiles={1}
            onDrop={handleDrop}
            className='relative aspect-[16/7]'
        >
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Spinner />
                </div>
            ) : (
                preview ? (
                    <Image
                        src={preview}
                        alt="Preview"
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
                    />
                ) : (<DropzoneEmptyState />))}

            <DropzoneContent >

            </DropzoneContent>
            {url && !preview && (
                <Image
                    src={url}
                    alt="Current Cover"
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw,(max-width: 1024px) 50vw, 33vw"
                />
            )}
        </Dropzone>
    )
}