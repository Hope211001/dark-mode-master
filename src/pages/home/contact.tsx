import { useState } from "react";
import { Mail, MapPin, Clock, Send, CheckCircle, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import HeaderHome from "@/components/partials/header/header.home";
import FooterHome from "@/components/partials/footer/footer.home";
import { apiClient } from "@/services/client";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      await apiClient.post("/contact", form);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi. Veuillez reessayer.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px]" />
      </div>

      <HeaderHome />

      <section className="relative z-10 pt-32 pb-12 md:pt-44 md:pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-8">
            <MessageSquare size={14} className="text-emerald-600" />
            <span className="text-xs md:text-sm font-medium text-emerald-700 uppercase tracking-wide">Contactez-nous</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-[1.1]">
            Une question ? <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Parlons-en.</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Notre equipe est la pour repondre a toutes vos questions.</p>
        </div>
      </section>

      <section className="relative z-10 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4"><Mail className="text-emerald-600" size={24} /></div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Email</h3>
                <p className="text-gray-500 text-sm">contact@immoscout.com</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4"><Clock className="text-purple-600" size={24} /></div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">Reponse rapide</h3>
                <p className="text-gray-500 text-sm">Nous repondons sous 24h en moyenne</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4"><MapPin className="text-teal-600" size={24} /></div>
                <h3 className="text-gray-900 font-bold text-lg mb-1">100% en ligne</h3>
                <p className="text-gray-500 text-sm">Plateforme SaaS accessible partout, 24/7</p>
              </div>
            </div>

            <div className="md:col-span-3">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                {sent ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6"><CheckCircle className="text-emerald-600" size={32} /></div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Message envoye !</h3>
                    <p className="text-gray-500 max-w-md">Merci pour votre message. Nous reviendrons vers vous dans les plus brefs delais.</p>
                    <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-8 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors">Envoyer un autre message</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Nom</label>
                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-gray-400" placeholder="Votre nom" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-gray-400" placeholder="votre@email.com" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Sujet</label>
                      <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-gray-400" placeholder="De quoi s'agit-il ?" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Message</label>
                      <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-colors placeholder:text-gray-400 resize-none" placeholder="Votre message..." />
                    </div>
                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                        <AlertCircle size={16} className="shrink-0" /> {error}
                      </div>
                    )}
                    <button type="submit" disabled={sending} className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {sending ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours...</> : <><Send size={16} /> Envoyer le message</>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterHome />
    </div>
  );
};

export default Contact;
