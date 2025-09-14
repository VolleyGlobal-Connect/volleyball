import Navbar from "@/components/navbar"
export default function PaymentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <section>
        <Navbar />
        {children}</section>
}
