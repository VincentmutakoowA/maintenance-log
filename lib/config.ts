// ==============================
// App / Site basics

import { title } from "process"

// ==============================
export const SITE_TITLE = "Next Autos"
export const COMPANY_NAME = "Next Autos ltd"
export const PRODUCT_OR_SERVICE = "Cars"
export const CURRENCY = "USD"

// ==============================
// Company identity
// ==============================
export const COMPANY_SLOGAN = "Your trusted partner in finding the perfect car."
export const COMPANYY_DESCRIPTION = "Next Autos is an innovative online platform dedicated to connecting car buyers and sellers. We offer a seamless experience with a wide range of vehicles, competitive prices, and exceptional customer service."
export const COMPANY_MISSION = "To simplify the car buying and selling experience through innovation and exceptional service."
export const COMPAN_VISION = "To be the leading online marketplace for cars, connecting buyers and sellers worldwide."

// ==============================
// Hero / marketing copy
// ==============================
export const HERO_INTRO = "Discover your next car"

// ==============================
// Contact information
// ==============================
export const CONTACT_EMAIL = "info@nextautos.com"
export const CONTACT_PHONE = "+256 789211701"
export const LOCATION = "High street, Mbarara, Uganda"
export const PHONE_NUMBER = "+256789211701"
export const WHATSAPP_NUMBER = "256789211701" //Don't include the '+' sign for WhatsApp links
export const GOOGLE_MAP_IFRAME_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.581520813338!2d30.64266087600151!3d-0.6242429352630368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19d91b552f762fdd%3A0x977e6a13e2ba8209!2sUniversity%20of%20Saint%20Joseph%20Mbarara!5e0!3m2!1sen!2sug!4v1770714181350!5m2!1sen!2sug"

// ==============================
// Team & values
// ==============================
export const COMPANY_TEAM_MESSAGE = "A dedicated team of professionals passionate about connecting people with the perfect cars."
export const COMPANY_CORE_VALUES = [
    {
        title: "Customer Focus",
        description:
            "We prioritize our customers' needs and strive to exceed their expectations.",
    },
    {
        title: "Integrity",
        description:
            "We conduct our business with honesty and transparency.",
    },
    {
        title: "Innovation",
        description:
            "We embrace change and continuously seek to improve our platform and services.",
    },
    {
        title: "Collaboration",
        description:
            "We believe in the power of teamwork and open communication.",
    },
]
export const COMPANY_TEAM = [
    {
        name: "Mutakoowa Vincent",
        role: "Founder & CEO",
        bio: "Vincent has over 15 years of experience in the automotive industry and is committed to revolutionizing the car buying experience.",
        imageUrl: "/team/vincent.jpeg",
    },
]

// ==============================
// SEO / metadata
// ==============================
export const KEY_WORDS = [
    "Next Autos",
    "Buy Cars",
    "Sell Cars",
]

export const AUTHORS = [
    { name: "Vilosoft company ltd", url: "wa.me/256789211701" },
]

// ==============================
// Social links
// ==============================
export const COMPANY_INSTAGRAM_URL =
    "https://instagram.com/next_autos"


// ==============================
// Storage buckets
// ==============================
export const PRODUCT_IMAGE_BUCKET = "product_images"
export const PRODUCT_VIDEO_BUCKET = "product_videos"
export const PRODUCT_COVER_BUCKET = "product_cover"

// ==============================
// Supabase
// ==============================
// Next.config.ts
export const NEXT_HOSTNAME = "tyojjcclfkgzmxoftjxu.supabase.co"

// ==============================
// Env
// ==============================
/*
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=xxxx
*/


// ==============================
// Legal
// ==============================
export const PRIVACY_POLICY_INTRO = `${COMPANY_NAME} respects your privacy and is committed to protecting your personal data.`
export const PRIVACY_POLICY = [
    {
        title: "Information We Collect",
        description: "We may collect personal information such as name, email address, and usage data.", },
    {
        title: "How We Use Your Information",
        description: "We use your information to provide and improve our services, communicate with you, and ensure security.",},
    {
        title: "Data Sharing and Security",
        description: "We do not sell your personal data. We implement security measures to protect your information.", },
    {
        title: "Your Rights",
        description: "You have the right to access, correct, or delete your personal information.",},
    {
        title: "Changes to This Policy",
        description: "We may update this privacy policy from time to time. We will change the date of last update accordingly.", },
    {
        title: "Contact Us",
        description: `If you have any questions about this privacy policy, please contact us at ${CONTACT_EMAIL}.`,}
]
export const TERMS_INTRO = `These Terms govern your use of ${COMPANY_NAME}'s website and services.`
export const TERMS_AND_CONDITIONS = [
    {
        title: "User Responsibilities",
        description: "You are responsible for your actions while using our services and must comply with all applicable laws.", },
    {
        title: "Intellectual Property",
        description: `${COMPANY_NAME} owns all content on the website. You may not copy, modify, or distribute any part of it without permission.`, },
    {
        title: "Limitation of Liability",
        description: "We are not liable for any damages arising from your use of our website, applications, or services." 
    },
    {
        title: "You agree not to",
        description: "Use our services for any illegal or unauthorized purpose, including but not limited to violating intellectual property rights, transmitting harmful content, or engaging in fraudulent activities."
    },
    {
        title: "Disclaimer of Warranties",
        description: "Our services are provided 'as is' without any warranties, express or implied. We do not guarantee the accuracy, uptime, or that our services will be uninterrupted or error-free."
    },
    {
        title: "Termination",
        description: "We reserve the right to terminate your access to our services for violations of these terms.", },
        {
            title: "Changes to Terms",
            description: "We may update these terms from time to time. We will post the new terms on this page.", },
     {
        title: "Contact Us",
        description: `If you have any questions about these terms, please contact us at ${CONTACT_EMAIL}.`,
        }
]