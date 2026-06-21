import Link from "next/link"

export function CTA() {
    return (
        <section className="relative overflow-hidden py-24">
            {/* Background layer */}
            <div className="absolute inset-0 -z-10">
                {/* base tint */}
                <div className="absolute inset-0 bg-gray-50" />
                {/* subtle grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.4]"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, #00000008 1px, transparent 1px), linear-gradient(to bottom, #00000008 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* green glow blobs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                <div className="glass rounded-3xl p-16 border border-green-500/10">
                    <h2 className="font-syne font-extrabold text-4xl md:text-5xl mb-6">
                        Ready to level up<br />your venue?
                    </h2>
                    <p className="font-dm text-gray-600 text-lg mb-10">
                        Join hundreds of venue owners already using FutsalPro.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-bold px-10 py-4 rounded-xl text-base transition-all hover:scale-[1.02] glow-green"
                    >
                        Create your account — it's free
                    </Link>
                </div>
            </div>
        </section>
    )
}