
import ErrorClient from "./error-client"

export default function Page({searchParams}: {searchParams: {message?: string}}) {
    const message = searchParams.message || "An error occurred"

    return (<ErrorClient message={message} />)
}