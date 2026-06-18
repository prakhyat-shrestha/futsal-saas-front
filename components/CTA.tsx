import Link from "next/link"

export function CTA() {
    return (
        <section className="relative z-10 max-w-4xl mx-auto px-8 py-24 text-center">
            <div className="glass rounded-3xl p-16 border border-green-500/10">
                <h2 className="font-syne font-extrabold text-4xl md:text-5xl mb-6">
                    Ready to level up<br />your venue?
                </h2>
                <p className="font-dm text-white/40 text-lg mb-10">
                    Join hundreds of venue owners already using FutsalPro.
                </p>
                <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-syne font-bold px-10 py-4 rounded-xl text-base transition-all hover:scale-[1.02] glow-green"
                >
                    Create your account — it's free
                </Link>
            </div>
        </section>
    )
}
