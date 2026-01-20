import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { 
  ArrowRight, ArrowLeft, Save, CheckCircle, UploadCloud, 
  Video, FileText, Plus, Trash2, GripVertical 
} from 'lucide-react';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../../auth/firebase';

const AddCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const editCourseId = searchParams.get('edit');

  const [step, setStep] = useState(1); // 1: Details, 2: Curriculum, 3: Review
  const [loading, setLoading] = useState(false);
  
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    status: 'draft',
    modules: []
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Load existing data logic (simplified for brevity)
    if (location.state?.courseData) {
      setCourseData(location.state.courseData);
    }
  }, [location.state]);

  const handleModuleAdd = () => {
    setCourseData(prev => ({
      ...prev,
      modules: [...prev.modules, { id: Date.now(), title: '', type: 'video', url: '' }]
    }));
  };

  const handleModuleChange = (index, field, value) => {
    const newModules = [...courseData.modules];
    newModules[index][field] = value;
    setCourseData({ ...courseData, modules: newModules });
  };

  const handleSave = async (status) => {
    // Save logic
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        navigate('/instructor/courses');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Wizard Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          {editCourseId ? 'Edit Course' : 'Create New Course'}
        </h1>
        <div className="mt-4 flex items-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {s}
              </div>
              <span className={`ml-2 text-sm font-medium ${step >= s ? 'text-slate-900' : 'text-slate-500'}`}>
                {s === 1 ? 'Basic Info' : s === 2 ? 'Curriculum' : 'Review'}
              </span>
              {s < 3 && <div className={`w-16 h-0.5 mx-4 ${step > s ? 'bg-brand-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Course Title</label>
            <input 
              value={courseData.title}
              onChange={(e) => setCourseData({...courseData, title: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Advanced React Patterns"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Category</label>
              <select 
                value={courseData.category}
                onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                <option value="">Select...</option>
                <option value="Web Development">Web Development</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-slate-700">Level</label>
              <select 
                value={courseData.level}
                onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea 
              rows={4}
              value={courseData.description}
              onChange={(e) => setCourseData({...courseData, description: e.target.value})}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="What will students learn in this course?"
            />
          </div>
        </div>
      )}

      {/* Step 2: Curriculum */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600"><UploadCloud size={20}/></div>
            <div>
              <h4 className="font-bold text-blue-900 text-sm">Content Upload</h4>
              <p className="text-blue-700 text-xs mt-1">Upload video lectures or PDF resources directly. Max size 100MB per file.</p>
            </div>
          </div>

          {courseData.modules.map((module, index) => (
            <div key={module.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 group-hover:bg-brand-500 transition-colors rounded-l-xl"></div>
              <button 
                onClick={() => {
                  const newModules = courseData.modules.filter(m => m.id !== module.id);
                  setCourseData({...courseData, modules: newModules});
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <div className="flex items-start gap-4">
                <div className="mt-3 text-slate-400 cursor-move"><GripVertical size={20} /></div>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Module Title</label>
                      <input 
                        value={module.title}
                        onChange={(e) => handleModuleChange(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        placeholder="e.g. Introduction to Variables"
                      />
                    </div>
                    <div className="w-48">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                      <select 
                        value={module.type}
                        onChange={(e) => handleModuleChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
                      >
                        <option value="video">Video Lecture</option>
                        <option value="pdf">PDF Document</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Content URL / File</label>
                    <div className="flex gap-2">
                      <input 
                        value={module.url}
                        onChange={(e) => handleModuleChange(index, 'url', e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-50"
                        placeholder={module.type === 'video' ? 'Paste YouTube or Storage URL' : 'Paste Document URL'}
                      />
                      <button className="px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200">
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button 
            onClick={handleModuleAdd}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} /> Add New Module
          </button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center animate-in fade-in slide-in-from-bottom-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Ready to Publish?</h2>
          <p className="text-slate-500 mt-2 mb-8">
            Your course <strong>"{courseData.title}"</strong> includes {courseData.modules.length} modules.
            It will be submitted for admin approval.
          </p>
          <div className="bg-slate-50 p-6 rounded-lg max-w-lg mx-auto text-left border border-slate-200">
            <h4 className="font-bold text-slate-700 mb-4 border-b border-slate-200 pb-2">Summary</h4>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-slate-500">Category:</span>
                    <span className="font-medium">{courseData.category}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Level:</span>
                    <span className="font-medium">{courseData.level}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-slate-500">Total Modules:</span>
                    <span className="font-medium">{courseData.modules.length}</span>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <button 
            onClick={() => step > 1 && setStep(step - 1)}
            disabled={step === 1}
            className="px-6 py-2.5 rounded-lg font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            Back
          </button>
          
          <div className="flex gap-3">
            {step === 3 ? (
                <button 
                    onClick={() => handleSave('published')}
                    className="px-8 py-2.5 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
                >
                    Submit for Review
                </button>
            ) : (
                <button 
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-2.5 rounded-lg font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 flex items-center gap-2"
                >
                    Continue <ArrowRight size={18} />
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;