import { Link } from "react-router-dom";
const LandingPage=()=>{
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            {/*navigation */}
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-blue-600">Secret Vault</h1>
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">Login</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 hover:rounded-full transition">Get Started</Link>
                </div>
            </nav>
            {/*hero */}
            <header className="text-center py-20 px-4 bg-gradient-to-b from-teal-50 to-white mb-[-1]">
                <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
                    Secure Your Digital Life<br/>
                    <span className="text-blue-600">With Zero Compromise.</span>            </h2>
                <p className="mt-7 text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                    The ultimate credential manager for developers. Store API keys, 
                    passwords, and secure notes with military-grade encryption.
                </p>
                <Link to='/register' className="bg-blue-600 text-white text-lg px-10 py-4 rounded-full font-bold shadow-xl shadow-blue-200 hover:scale-105 hover:rounded-lg transition-transform inline-block">Start Vaulting - It's Free</Link>
            </header>
            {/*feature grid */}
            <section className="max-w-7xl  mx-auto py-20 px-6 grid md:grid-cols-3 gap-12">
                <FeatureCard
                    icon='🔐'
                    title="AES-256 Encryption"
                    desc="Your data is encrypted before it even leaves your browser. Only you hold the keys."
                />
                <FeatureCard
                    icon="🚀" 
                    title="Developer First" 
                    desc="Dedicated categories for API keys and environment variables. Built by devs, for devs."
                />
                <FeatureCard
                    icon="⏱️" 
                    title="Auto-Lock" 
                    desc="Inactivity timers ensure your vault stays locked even if you walk away from your desk."
                />
            </section>
            {/*footer */}
            <footer className="border-t border-gray-100 text-center text-gray-400 mb-5">
                <p className="mt-2">© 2026 Secret Vault. Created by Janhvi.</p>
            </footer>
        </div>
    )
}
const FeatureCard=({icon,title,desc})=>(
    <div className="p-8 border border-gray-200 rounded-3xl hover:shadow-xl transition-shadow bg-white">
        <div className="text-4xl mb-4">{icon}</div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
)
export default LandingPage;