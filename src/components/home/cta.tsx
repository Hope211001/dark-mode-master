import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
const cta = () => {
    return (
        <div>
            <section className="relative z-10 px-4 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Prêt à automatiser votre prospection ?
                        </h2>
                        <p className="text-gray-400 mb-8 text-lg">
                            Rejoignez les investisseurs qui ont déjà trouvé leurs meilleures affaires
                        </p>
                        <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center mx-auto font-semibold">
                            <Link to='/register'>Créer mon compte gratuitement</Link>
                            <ArrowRight className="ml-2" size={20} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default cta