'use client'
import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function ProductCover({
    uid,
    url,
    size,
    onUpload,
}: {
    uid: string | null
    url: string | null
    size: number
    onUpload: (url: string, path: string) => void
}) {
    const supabase = createClient()
    const [uploading, setUploading] = useState(false)

    const uploadCover: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const filePath = `temp/${uid}-${crypto.randomUUID()}.${fileExt}`
            console.log(file.size, file.type)

            const { error: uploadError } = await supabase
                .storage
                .from('product_cover')
                .upload(filePath, file, {
                    contentType: file.type, upsert: true
                })

            if (uploadError) throw uploadError

            const { data } = supabase
                .storage
                .from('product_cover')
                .getPublicUrl(filePath)

            onUpload(data.publicUrl, filePath)
        } catch (error) {
            alert('Error uploading Cover')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className=''>
            {url ? (
                <Image
                    width={size}
                    height={size}
                    src={url}
                    alt="Avatar"
                    className="avatar image bg-gray-200 rounded-4xl mx-2"
                />
            ) : (
                <div className="" />
            )}
            <div style={{ width: size }} className=''>
                <Button variant="outline" className='my-2' type='button'>
                    <label className="button primary block" htmlFor="single">
                        {uploading ? 'Uploading ...' : 'Upload'}
                    </label>
                </Button>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadCover}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}