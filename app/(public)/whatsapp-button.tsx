"use client"

import { Button } from "@base-ui/react";
import { WHATSAPP_NUMBER } from "@/lib/config"
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {

    function WhatsAppMessage() {
        const message = `Hello, I would like to inquire about your products and services.`
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <Button onClick={WhatsAppMessage} className="fixed bottom-20 right-0 z rounded-l-full bg-green-500 hover:bg-green-600 text-white p-2 shadow-lg" aria-label="WhatsApp Button">
            <MessageCircle className="h-5 w-5 text-background" />
        </Button>
    )
}