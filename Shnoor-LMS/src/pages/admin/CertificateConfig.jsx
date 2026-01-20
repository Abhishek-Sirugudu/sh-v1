import React, { useState } from 'react';
import { Save, Image, PenTool, LayoutTemplate } from 'lucide-react';

const CertificateConfig = () => {
    const [config, setConfig] = useState({
        issuerName: 'SHNOOR Academy',
        authorityTitle: 'Director of Education',
        signatureUrl: '',
        templateUrl: ''
    });

    const handleSave = (e) => {
        e.preventDefault();
        alert("Configuration saved successfully!");
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Certificate Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <LayoutTemplate size={20} className="text-slate-400"/> Configuration
                    </h3>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Issuer Organization Name</label>
                            <input 
                                value={config.issuerName}
                                onChange={e => setConfig({...config, issuerName: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Signing Authority Title</label>
                            <input 
                                value={config.authorityTitle}
                                onChange={e => setConfig({...config, authorityTitle: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                                <Image size={16} /> Background Template URL
                            </label>
                            <input 
                                value={config.templateUrl}
                                onChange={e => setConfig({...config, templateUrl: e.target.value})}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                                <PenTool size={16} /> Signature Image URL
                            </label>
                            <input 
                                value={config.signatureUrl}
                                onChange={e => setConfig({...config, signatureUrl: e.target.value})}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                            />
                        </div>
                        <button className="w-full py-2.5 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 transition-colors flex justify-center items-center gap-2 mt-4">
                            <Save size={18} /> Save Settings
                        </button>
                    </form>
                </div>

                {/* Live Preview */}
                <div className="bg-slate-100 p-8 rounded-xl border border-slate-200 flex items-center justify-center">
                    <div className="bg-white w-full aspect-[1.4/1] shadow-xl relative p-8 flex flex-col items-center justify-center text-center border-[10px] border-brand-900">
                        {config.templateUrl && (
                            <img src={config.templateUrl} className="absolute inset-0 w-full h-full object-cover opacity-10" alt="bg" />
                        )}
                        <div className="relative z-10 w-full h-full flex flex-col">
                            <h2 className="text-3xl font-serif text-brand-900 mt-8 mb-2 uppercase tracking-widest">Certificate</h2>
                            <p className="text-slate-500 italic text-sm mb-6">of Completion</p>
                            
                            <div className="text-xl font-bold text-slate-800 border-b border-slate-300 pb-2 mb-6 mx-12">
                                Student Name
                            </div>

                            <div className="mt-auto flex justify-between px-8 mb-4">
                                <div className="text-center">
                                    <div className="h-8 mb-1 flex items-end justify-center">
                                        {config.signatureUrl ? <img src={config.signatureUrl} className="h-8" alt="sign" /> : <span className="font-cursive text-lg">Signature</span>}
                                    </div>
                                    <div className="border-t border-slate-400 w-32 pt-1 text-[10px] uppercase tracking-wider text-slate-500">
                                        {config.authorityTitle}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="h-8 mb-1 flex items-end justify-center text-sm font-medium">
                                        {new Date().toLocaleDateString()}
                                    </div>
                                    <div className="border-t border-slate-400 w-32 pt-1 text-[10px] uppercase tracking-wider text-slate-500">
                                        Date Issued
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateConfig;