import React, { useState } from 'react';
import { Award, Download, Printer, ArrowLeft } from 'lucide-react';

const MyCertificates = () => {
    const [selectedCert, setSelectedCert] = useState(null);

    // Mock Data
    const certificates = [
        { id: '1', course: 'Advanced React Patterns', date: 'Oct 12, 2025', instructor: 'Sarah J.', score: 98 },
        { id: '2', course: 'Python for Data Science', date: 'Nov 05, 2025', instructor: 'Mike R.', score: 92 },
    ];

    const handlePrint = () => window.print();

    if (selectedCert) {
        return (
            <div className="min-h-screen bg-slate-100 p-8 flex flex-col items-center">
                <div className="w-full max-w-4xl flex justify-between items-center mb-6 print:hidden">
                    <button onClick={() => setSelectedCert(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 shadow-sm">
                        <Printer size={18} /> Print Certificate
                    </button>
                </div>

                {/* Certificate Paper */}
                <div className="bg-white w-full max-w-5xl aspect-[1.414/1] shadow-2xl border-[20px] border-brand-900 relative p-12 flex flex-col items-center justify-center text-center print:shadow-none print:w-full print:h-screen print:border-0">
                    <div className="absolute inset-4 border-4 border-brand-100"></div>
                    <div className="absolute top-12 left-1/2 -translate-x-1/2">
                        <Award size={64} className="text-brand-500" />
                    </div>
                    
                    <h1 className="text-5xl font-serif text-brand-900 mt-16 mb-4 tracking-wide uppercase">Certificate of Completion</h1>
                    <p className="text-xl text-slate-500 italic mb-8">This is to certify that</p>
                    
                    <h2 className="text-4xl font-bold text-slate-900 border-b-2 border-slate-300 pb-2 mb-8 px-12 min-w-[400px]">
                        Student Name
                    </h2>
                    
                    <p className="text-lg text-slate-600 max-w-2xl leading-relaxed mb-12">
                        Has successfully completed the course <strong>{selectedCert.course}</strong><br/>
                        demonstrating high proficiency with a final score of <strong>{selectedCert.score}%</strong>.
                    </p>

                    <div className="flex justify-between w-full max-w-3xl mt-auto px-12">
                        <div className="text-center">
                            <div className="font-signature text-3xl text-brand-800 mb-2">{selectedCert.instructor}</div>
                            <div className="border-t border-slate-400 w-48 pt-2 text-xs uppercase tracking-wider text-slate-500">Instructor</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl text-slate-800 mb-2 mt-2">{selectedCert.date}</div>
                            <div className="border-t border-slate-400 w-48 pt-2 text-xs uppercase tracking-wider text-slate-500">Date Issued</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map(cert => (
                    <div 
                        key={cert.id} 
                        onClick={() => setSelectedCert(cert)}
                        className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Award size={80} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-brand-600 transition-colors">{cert.course}</h3>
                            <p className="text-sm text-slate-500 mb-4">Issued: {cert.date}</p>
                            <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                                <Download size={14} /> View Certificate
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCertificates;