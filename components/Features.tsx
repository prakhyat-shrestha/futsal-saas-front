

export function Features() {
    return (
        <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-24">
            <div className="text-center mb-16">
                <h2 className="font-syne font-bold text-4xl md:text-5xl mb-4 text-gray-900">
                    Everything you need.
                </h2>
                <p className="font-dm text-gray-500 text-lg max-w-xl mx-auto">
                    Built for venue owners who want to scale.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {FEATURES.map((f, i) => (
                    <div
                        key={f.title}
                        className="glass rounded-2xl p-8 group hover:border-green-500/20 transition-all duration-300 animate-fade-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                            <span className="text-green-600 text-2xl">{f.icon}</span>
                        </div>
                        <h3 className="font-syne font-semibold text-lg mb-3 text-gray-900">{f.title}</h3>
                        <p className="font-dm text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    )
}


const FEATURES = [
    {
        icon: "🏟️",
        title: "Multi-Venue Management",
        desc: "Manage multiple venues and courts from a single dashboard. Each venue has its own schedule, courts, and pricing.",
    },
    {
        icon: "📅",
        title: "Smart Booking System",
        desc: "Real-time slot availability, instant confirmations, and automated conflict prevention across all courts.",
    },
    {
        icon: "👥",
        title: "Role-Based Access",
        desc: "Separate dashboards for venue admins and players. Granular permissions to control who sees what.",
    },
    {
        icon: "📊",
        title: "Revenue Analytics",
        desc: "Track bookings, revenue, and occupancy rates. Make data-driven decisions to grow your business.",
    },
    {
        icon: "🔒",
        title: "Multi-Tenant Security",
        desc: "Each vendor's data is fully isolated. Your tenants' data never mixes with another's.",
    },
    {
        icon: "📱",
        title: "Mobile First",
        desc: "Fully responsive design optimized for players to book on their phones in seconds.",
    },
];