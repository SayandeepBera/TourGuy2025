import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  X
} from 'lucide-react';
import FormSlide1 from './FormSlide1';
import FormSlide2 from './FormSlide2';
import FormSlide3 from './FormSlide3';
import FormSlide4 from './FormSlide4';

const GuidesRegistrationForm = ({ setShowForm }) => {
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: {
      countryCode: '',
      number: ''
    },
    age: '',
    gender: '',
    city: '',
    country: '',
    languages: '',
    bio: '',
    username: '',
    password: '',
    profilePhoto: null,
    documents: null,
  });

  // Function to close the form
  const closeForm = () => {
    setShowForm(false);
    setTimeout(() => setFormStep(1), 300);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#05070c]/98 backdrop-blur-3xl"
    >
      <motion.div
        initial={{ scale: 0.8, y: 100, rotateX: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
        exit={{ scale: 0.8, y: 50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative top-15 md:top-10 w-full max-w-5xl bg-[#141b2d] rounded-[3rem] overflow-hidden shadow-[0_0_120px_rgba(0,196,204,0.4)] border border-white/10 flex flex-col md:flex-row max-h-[100svh] md:max-h-[90vh]"
      >
        {/* Side Brand Column */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-[#00C4CC] to-[#005f63] p-12 flex-col justify-between text-white relative">
          <div className="z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <Sparkles className="w-16 h-16 mb-8 text-white/40 shadow-white" />
            </motion.div>
            <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">Start Your <br /> Journey.</h2>
            <p className="text-white/80 text-lg leading-relaxed font-medium">
              {formStep === 1 && "Authenticity begins with identity. Set up your global guide profile in minutes."}
              {formStep === 2 && "Where are you based? Tell us about your background and language skills."}
              {formStep === 3 && "Visuals and verification. Upload your headshot and supporting documents."}
              {formStep === 4 && "Finalize your account security and agree to our community standards."}
            </p>
          </div>

          <div className="z-10">
            <div className="flex flex-wrap gap-4 mb-10">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all duration-700 ${formStep >= step ? 'bg-white text-[#00C4CC] shadow-[0_10px_20px_rgba(255,255,255,0.2)]' : 'bg-white/10 text-white/40'}`}>
                    {formStep > step ? <Check size={24} /> : step}
                  </div>
                  {step < 4 && <div className={`w-4 h-1 rounded-full transition-all duration-500 ${formStep > step ? 'bg-white' : 'bg-white/10'}`} />}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-white/40 text-xs font-black tracking-widest uppercase">
              <ShieldCheck size={14} /> 100% Secure & Encrypted
            </div>
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
        </div>

        {/* Form Content Column */}
        <div className="flex-1 p-8 md:px-15 md:py-7.5 relative bg-[#0b0f1a]/60 backdrop-blur-md overflow-y-auto max-h-[100svh] md:max-h-[90vh]">
          <button onClick={closeForm} className="absolute top-5 right-5 md:top-10 md:right-10 p-2 md:p-4 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90 hover:scale-110 active:scale-95 shadow-xl z-20">
            <X size={24} />
          </button>

          <AnimatePresence mode="wait">
            {formStep === 1 && (<FormSlide1 setFormStep={setFormStep} formData={formData} setFormData={setFormData} />)}
            {formStep === 2 && (<FormSlide2 setFormStep={setFormStep} formData={formData} setFormData={setFormData} />)}
            {formStep === 3 && (<FormSlide3 setFormStep={setFormStep} formData={formData} setFormData={setFormData} />)}
            {formStep === 4 && (<FormSlide4 setFormStep={setFormStep} closeForm={closeForm} formData={formData} setFormData={setFormData} />)}
          </AnimatePresence>

        </div>
      </motion.div>
    </motion.div>
  )
}

export default GuidesRegistrationForm
